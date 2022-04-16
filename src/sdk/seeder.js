import stats from './seeder/stats';
import downloadProgress from './seeder/downloadProgress';
const debug = require('debug')('webtor:sdk:seeder');
const Url = require('url-parse');
var md5 = require('md5');

class WebSeeder {
    constructor(infoHash, params, sdk) {
        this.infoHash = infoHash;
        this.params = params;
        this.sdk = sdk;
    }

    addDownloadId(metadata = {}, path) {
        if (!metadata['download-id']) {
            metadata = Object.assign({}, metadata, {
                'download-id': md5(metadata['user-id'] + this.infoHash + path + Date.now().toString()),
            });
        }
        return metadata;
    }

    async url(path, metadata = {}, params = {}, context = {}) {
        params = Object.assign({}, this.params, params);
        path = path.replace(/^\//, '');
        let url = new Url(params.apiUrl);
        metadata = this.addDownloadId(metadata, path);
        url.infoHash = this.infoHash;
        url.path = path;
        const pathname = '/' + this.infoHash + '/' + encodeURIComponent(path);
        url.infoHash = this.infoHash;
        url.set('pathname', pathname);
        const query = await this.sdk.util.makeQuery(metadata, params);
        url.set('query', query);

        if (params.subdomains) {
            url = await this.sdk.util.cacheUrl(url, metadata, params);
            const cached = await this.sdk.util.isCached(url, metadata, params);
            // const completedPieces = await this.sdk.util.throttledCompletedPieces(url, metadata, params);
            // const pieceCache = completedPieces.length > 0;
            const deliveryType = this.sdk.util.getDeliveryType(url.pathname);
            if (deliveryType === undefined) return url;
            let pool = deliveryType == 'transcode' ? params.pools.transcoder : params.pools.seeder;
            pool = cached ? params.pools.cache : pool;
            const m = {
                infohash: this.infoHash,
                "use-bandwidth": cached,
                "use-cpu": !cached,
                "skip-active-job-search": cached,
                pool: pool.join(','),
            }
            const subdomainUrl = await this.sdk.util.subdomainUrl(url, context, m, params);
            if (subdomainUrl === false) return false;
            subdomainUrl.primaryHost = url.host;
            if (subdomainUrl) {
                return subdomainUrl;
            }
        }
        return url;
    }

    async urlPostProcess(url, metadata, params) {
        const cp = await this.completedPieces(metadata, params);
        if (cp.length == 0) {
            return url;
        }
        const cdnUrl = this.sdk.util.cdnUrl(url, metadata, params);
        if (cdnUrl) {
            return cdnUrl;
        }
        return url;
    }

    async streamUrl(path, metadata = {}, params = {}, context = {}) {
        params = Object.assign({}, this.params, params);
        let url = await this.url(path, metadata, params, context);
        url = await this.sdk.util.streamUrl(url, metadata, params, context);
        url = await this.urlPostProcess(url, metadata, params);
        return url;
    }

    async segmentUrl(path, segment, context = {}, metadata = {}, params = {}) {
        params = Object.assign({}, this.params, params);
        let url = await this.url(path, metadata, params, context);
        if (url === false) return false;
        url = await this.sdk.util.segmentUrl(url, segment, metadata, params, context);
        url = await this.urlPostProcess(url, metadata, params);
        return url;
    }

    async error(path, metadata = {}, params = {}, context = {}) {
        params = Object.assign({}, this.params, params);
        let url = await this.url(path, metadata, params, context);
        return await this.sdk.util.error(url, metadata, params);
    }

    async pieceUrl(id, metadata = {}, params = {}) {
        let url = await this.url('', metadata, params);
        return this.sdk.util.pieceUrl(url, id);
    }

    async mediaInfo(path, metadata = {}, params = {}) {
        params = Object.assign({}, this.params, params);
        const url = await this.url(path, metadata, params);
        return await this.sdk.util.mediaInfo(url, metadata, params);
    }

    async completedPieces(metadata = {}, params = {}) {
        params = Object.assign({}, this.params, params);
        const url = await this.url('', metadata, params);
        return await this.sdk.util.throttledCompletedPieces(url, metadata, params);
    }

    async isCached(path, metadata = {}, params = {}) {
        params = Object.assign({}, this.params, params);
        const url = await this.url(path, metadata, params);
        const cached = await this.sdk.util.isCached(url, metadata, params);
        return cached;
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
        url = await this.urlPostProcess(url, metadata, params);
        return url;
    }

    async downloadUrlWithProgress(path, onMessage, onEnd, metadata = {}, params = {}, context = {}) {
        params = Object.assign({}, this.params, params, {cdn: false});
        metadata = this.addDownloadId(metadata, path);
        const downloadUrl = await this.downloadUrl(path, metadata, params, context);
        const fileName = path.split('/').pop();
        const url = this.sdk.util.dpUrl(downloadUrl, fileName);
        const statUrl = this.sdk.util.dpStatUrl(downloadUrl);
        downloadProgress(statUrl, path, onMessage, onEnd, metadata, params); 
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
    async zipUrlWithProgress(path, onMessage, onEnd, metadata = {}, params = {}, context = {}) {
        params = Object.assign({}, this.params, params, {cdn: false});
        metadata = this.addDownloadId(metadata, path);
        const zipUrl = await this.zipUrl(path, metadata, params, context);
        const fileName = path.split('/').pop() + '.zip';
        const url = this.sdk.util.dpUrl(zipUrl, fileName);
        const statUrl = this.sdk.util.dpStatUrl(zipUrl);
        downloadProgress(statUrl, path, onMessage, onEnd, metadata, params); 
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