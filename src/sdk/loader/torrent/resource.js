import parseTorrent from 'parse-torrent';
class Content {
    constructor({path, name, type}, sdk, seeder) {
        this.path   = path;
        this.name   = name;
        this.type   = type;
        this.sdk    = sdk;
        this.seeder = seeder;
    }
    get isFile() {
        return this.type == 'file';
    }
    get isDir() {
        return this.type == 'dir';
    }
    get mediaType() {
        if (this.isDir) return null;
        return this.sdk.util.getMediaType(this.name);
    }
    async getMimeType() {
        if (this.isDir) return null;
        return this.sdk.util.getMimeType(await this.getStreamUrl());
    }
    async deliveryType() {
        if (this.isDir) return null;
        return this.sdk.util.getDeliveryType(this.name);
    }
    async getStreamUrl() {
        if (this.isDir) return null;
        return await this.seeder.streamUrl(this.path);
    }
    async getSegmentUrl(s, c) {
        if (this.isDir) return null;
        return await this.seeder.segmentUrl(this.path, s, c);
    }
}
class File extends Content {
    constructor(i, sdk, seeder) {
        super({
            path: '/' + i.path,
            name: i.name,
            type: 'file',
        }, sdk, seeder);
        this.length = i.length;
    }
}
class Dir extends Content {
    constructor(path, name, sdk, seeder) {
        super({
            path,
            name,
            type: 'dir',
        }, sdk, seeder);
        this.content = {};
    }
}
class Resource {
    type = 'torrent';
    constructor(torrent, sdk, seeder) {
        this.id = torrent.infoHash;
        this.torrent = torrent;
        this.sdk = sdk;
        this.seeder = seeder;
    }
    get title() {
        return this.torrent.name;
    }
    get shortType() {
        return this.type.charAt(0);
    }
    get magnetUri() {
        return parseTorrent.toMagnetURI(this.torrent);
    }
    addBranch(tree, parts, file, path) {
        if (parts.length == 0) return new File(file, this.sdk, this.seeder);
        const part = parts.shift();
        path.push(part);
        if (parts.length > 0) {
            if (tree[part] == undefined) {
                tree[part] = new Dir('/' + path.join('/'), part, this.sdk, this.seeder);
            }
            tree[part].content = this.addBranch(tree[part].content, parts, file, path); 
        } else {
            tree[part] = new File(file, this.sdk, this.seeder);
        }
        return tree;
    }
    get tree() {
        let tree = {};
        for (let file of this.torrent.files) {
            const pathParts = file.path.split('/');
            tree = this.addBranch(tree, pathParts, file, []);
        }
        return tree;
    }
    get root() {
        return '/' + Object.keys(this.tree)[0];
    }
    dirname(path) {
        path = path.replace(/^\//, '').replace(/\/$/, '');
        path = path.split('/');
        let tree = this.tree;
        let dir = [];
        while (true) {
            const p = path.shift(path);
            if (tree[p] && tree[p].isDir) {
                dir.push(p);
                tree = tree[p].content;
            } else {
                break;
            }
        }
        return '/' + dir.join('/');
    }
    filename(path) {
        path = path.replace(/^\//, '').replace(/\/$/, '');
        path = path.split('/');
        let tree = this.tree;
        while (true) {
            const p = path.shift(path);
            if (tree[p]) {
                tree = tree[p];
            } else {
                break;
            }
        }
        if (tree.isFile && tree.isFile) {
            return tree.name;
        }
        return null
    }
    ls(path) {
        path = path.replace(/^\//, '').replace(/\/$/, '');
        if (!path) {
            path = [];
        } else {
            path = path.split('/');
        }
        let c = this.tree;
        for (let p of path) {
            c = c[p].content;
        }
        let res = [];
        for (let i in c) {
            res.push(c[i]);
        }
        if (path.length > 1) {
            path.pop();
            res.push(new Dir(
                path.join('/'),
                '..',
            ));
        }
        res = res.sort((a, b) => a.name.localeCompare(b.name));
        return res;
    }
}
export default function newResource(torrent, sdk) {

    const seeder = sdk.seeder.get(torrent.infoHash);
    return new Resource(torrent, sdk, seeder);
}