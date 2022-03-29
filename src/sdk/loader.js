import parseTorrent from 'parse-torrent';
import newTorrentResource from './loader/torrent/resource';
const debug = require('debug')('webtor:sdk:loader');
export default function(params, sdk) {
    const self = {params, sdk};
    return {
        async load(source, metadata, params = {}) {
            debug('loading source=%o', source);

            params = Object.assign(self.params, params);
            let torrent = false;
            if (torrent == false) torrent = await this.loadTorrentObject(source, metadata, params);
            if (torrent == false) torrent = await this.loadTorrentFile(source, metadata, params);
            if (torrent == false) torrent = await this.loadMagnet(source, metadata, params);
            if (torrent == false) torrent = await this.loadTorrentUrl(source, metadata, params);
            if (torrent != false) await this.pushTorrent(torrent, metadata, params);
            if (torrent == false) throw 'failed to load resource';
            return newTorrentResource(torrent, sdk);
        },
        async loadById(type, id, metadata, params = {}) {
            debug('loading type=%o id=%o', type, id);
            params = Object.assign(self.params, params);
            if (type == 'torrent' || type == 't') {
                let torrent = false;
                if (torrent == false) torrent = await this.loadMagnet(id, metadata, params);
                if (torrent != false) await this.pushTorrent(torrent, metadata, params);
                return newTorrentResource(torrent, sdk);
            }
        },
        async pushTorrent(torrent, metadata, params = {}) {
            const expire = 60 * 60 * 24 * 30; // 1 month
            params = Object.assign(self.params, params);
            debug('push torrent infohash=%o', torrent.infoHash);
            try {
                return await sdk.torrent.touch(torrent, expire, metadata);
            } catch (e) {
                if (e == 'not found') {
                    try {
                        return await sdk.torrent.push(torrent, expire, metadata);
                    } catch (e) {
                        debug(e);
                        throw e;
                    }
                } else {
                    debug(e);
                    throw e;
                }
            }
        },
        async loadTorrentObject(source, metadata, params = {}) {
            if (!(typeof source == 'object' && source.infoHash != undefined && source.files != undefined)) return false;
            return source;
        },
        async loadTorrentUrl(source, metadata, params = {}) {
            if (!source.match(/^http/)) return false;
            if (!source.match(/\.torrent$/) && !source.match(/[a-fA-F0-9]{40}/)) {
                return false;
            }
            source = await sdk.ext.url(source);
            return await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.addEventListener('error', reject);
                xhr.onreadystatechange = async function() {
                    if (this.readyState == XMLHttpRequest.DONE) {
                        const ab = new Uint8Array(this.response);
                        const buffer = new Buffer(ab.byteLength);
                        const view = new Uint8Array(ab);
                        for (let i = 0; i < buffer.length; ++i) {
                            buffer[i] = view[i];
                        }
                        resolve(parseTorrent(buffer));
                    }
                };
                xhr.open('GET', source);
                xhr.responseType = 'arraybuffer';
                xhr.send();
            });
        },
        async loadTorrentFile(source, metadata, params = {}) {
            if (!(typeof source == 'object' && source.type == 'application/x-bittorrent' && source.size)) return false;
            try {
                const b = await this.fileToArray(source);
                return parseTorrent(b);
            } catch (e) {
                debug(e);
                throw e;
            }
        },
        async loadMagnet(source, metadata, params = {}) {
            params = Object.assign(self.params, params);
            let torrent = null;
            if (!source.match(/^magnet/) && !source.match(/^[a-fA-F0-9]{40}$/)) {
                return false;
            }
            try {
                torrent = parseTorrent(source);
            } catch (e) {
                debug(e);
                throw e;
            }
            const infoHash = torrent.infoHash;
            if (infoHash && params.db) {
                debug('loading from local db infohash=%o', infoHash)
                torrent = await params.db.pullTorrent(infoHash);
            }
            if (!torrent || !torrent.pieces || torrent.pieces.length == 0) {
                try {
                    debug('loading from torrent store infohash=%o', infoHash)
                    torrent = await sdk.torrent.pull(infoHash, metadata);
                } catch (e) {
                    debug(e);
                    throw e;
                }
            }
            if (!torrent) {
                debug('loading by magnet uri from peers magnet=%o', source);
                torrent = await sdk.magnet.fetchTorrent(source, metadata);
            }
            return torrent;
        },
        fileToArray(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.addEventListener('load', (e) => {
                    const arr = new Uint8Array(e.target.result);
                    const buffer = new Buffer(arr);
                    try {
                        resolve(buffer);
                    } catch(e) {
                        reject(e);
                    }
                });
                reader.addEventListener('error', (err) => {
                    reject(err);
                });
                reader.readAsArrayBuffer(file);
          });
        }
    };
};