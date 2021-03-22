import stats from './seeder/stats';
const debug = require('debug')('webtor:sdk:seeder');
const Url = require('url-parse');

class WebSeeder {
    constructor(infoHash, params, sdk) {
        this.infoHash = infoHash;
        this.params = params;
        this.sdk = sdk;
    }

    async url(path, metadata = {}, params = {}, context = {}) {
        params = Object.assign({}, this.params, params);
        path = path.replace(/^\//, '');
        let url = new Url(params.apiUrl);
        url.infoHash = this.infoHash;
        url.path = path;
        const pathname = '/' + this.infoHash + '/' + encodeURIComponent(path);
        url.infoHash = this.infoHash;
        url.set('pathname', pathname);
        const query = await this.sdk.util.makeQuery(metadata, params);
        url.set('query', query);

        if (params.cache) {
            url = await this.sdk.util.cacheUrl(url, metadata, params);
            const cached = await this.sdk.util.isCached(url, metadata, params);
            const pool = cached ? 'cache,core,worker' : 'worker';
            const subdomainUrl = await this.sdk.util.subdomainUrl(url, {
                infohash: this.infoHash,
                pool,
                "use-bandwidth": cached,
                // "use-cpu": cached
            }, params, context);
            if (subdomainUrl) {
                return subdomainUrl;
            }
        }
        return url;
    }

    async urlPostProcess(url, metadata, params) {
        const cp = await this.completedPieces(url, metadata, params);
        if (cp.length == 0) {
            return url;
        }
        const cdnUrl = this.sdk.util.cdnUrl(url);
        if (cdnUrl) {
            return cdnUrl;
        }
        return url;
    }

    async streamUrl(path, metadata = {}, params = {}, context = {}) {
        params = Object.assign({}, this.params, params);
        let url = await this.url(path, metadata, params, context);
        url = await this.sdk.util.streamUrl(url, metadata, params, context);
        url = await this.urlPostProcess(url);
        return url;
    }

    async segmentUrl(path, segment, metadata = {}, params = {}, context = {}) {
        params = Object.assign({}, this.params, params);
        let url = await this.url(path, metadata, params, context);
        url = await this.sdk.util.segmentUrl(url, segment, metadata, params, context);
        url = await this.urlPostProcess(url);
        return url;
    }

    async pieceUrl(id, metadata = {}, params = {}) {
        let url = await this.url('', metadata, params);
        return this.sdk.util.pieceUrl(url, id);
    }

    async mediaInfo(path, metadata = {}, params = {}) {
        const url = await this.url(path, metadata, params);
        return await this.sdk.util.mediaInfo(url);
    }

    async completedPieces(metadata = {}, params = {}) {
        params = Object.assign({}, this.params, params);
        const url = await this.url('', metadata, params);
        return await this.sdk.util.throttledCompletedPieces(url, metadata, params);
    }

    async openSubtitles(path, metadata = {}, params = {}) {
        const url = await this.url(path, metadata, params);
        return await this.sdk.util.openSubtitles(url);
    }

    async downloadUrl(path, metadata = {}, params = {}, context = {}) {
        params = Object.assign({}, this.params, params);
        if (params.downloadUrl) {
            params.apiUrl = params.downloadUrl;
        }
        metadata.download = true;
        let url = await this.url(path, metadata, params, context);
        url = await this.urlPostProcess(url);
        return url;
    }

    async zipUrl(path, metadata = {}, params = {}, context = {}) {
        params = Object.assign({}, this.params, params);
        if (params.downloadUrl) {
            params.apiUrl = params.downloadUrl;
        }
        const fileName = path.split('/').pop();
        let url = await this.url(path, metadata, params, context);
        url.set('pathname', url.pathname + '~arch/' + fileName + '.zip');
        return url;
    }

    stats(path, onMessage, metadata = {}, params = {}) {
        params = Object.assign({}, this.params, params);
        const url = `${params.apiUrl}/${this.infoHash}`;
        debug('get file stats infoHash=%s url=%s path=%s metadata=%o', this.infoHash, url, path, metadata);
        return stats(url, path, onMessage, metadata, params);
    }
}

export default function(params, sdk) {
    const self = {params, sdk};
    return {
        get(infoHash, metadata = {}, params = {}) {
            params = Object.assign({}, self.params, params);
            return new WebSeeder(infoHash, params, self.sdk);
        },
    };
};