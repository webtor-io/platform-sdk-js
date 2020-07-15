import stats from './seeder/stats';
const debug = require('debug')('webtor:sdk:seeder');
const Url = require('url-parse');

class WebSeeder {
    constructor(infoHash, params, sdk) {
        this.infoHash = infoHash;
        this.params = params;
        this.sdk = sdk;
    }

    async url(path, metadata = {}, params = {}) {
        params = Object.assign(this.params, params);
        let url = new Url(params.apiUrl);
        const pathname = '/' + this.infoHash + '/' + encodeURIComponent(path.replace(/^\//, ''));
        url.set('pathname', pathname);
        const query = await this.sdk.util.makeQuery(metadata, params);
        url.set('query', query);
        if (params.cache) url = this.sdk.util.tcUrl(url);
        return url;
    }

    async streamSubtitleUrl(path, viewSettings = {}, metadata = {}, params = {}) {
        const url = await this.url(path, metadata, params);
        return this.sdk.util.streamSubtitleUrl(url, viewSettings);
    }

    async streamUrl(path, viewSettings = {}, metadata = {}, params = {}) {
        let url = await this.url(path, metadata, params);
        return this.sdk.util.streamUrl(url, viewSettings);
    }

    async pieceUrl(id, metadata = {}, params = {}) {
        let url = await this.url('', metadata, params);
        return this.sdk.util.pieceUrl(url, id);
    }

    async mediaInfo(path, viewSettings = {}, metadata = {}, params = {}) {
        const url = await this.url(path, metadata, params);
        return await this.sdk.util.mediaInfo(url, viewSettings);
    }

    async completedPieces(viewSettings = {}, metadata = {}, params = {}) {
        const url = await this.url('', metadata, params);
        return await this.sdk.util.completedPieces(url);
    }

    async openSubtitles(path, metadata = {}, params = {}) {
        const url = await this.url(path, metadata, params);
        return await this.sdk.util.openSubtitles(url);
    }

    async downloadUrl(path, metadata = {}, params = {}) {
        params = Object.assign(this.params, params);
        if (params.downloadUrl) {
            params.apiUrl = params.downloadUrl;
        }
        metadata.download = true;
        const url = await this.url(path, metadata, params);
        return url;
    }

    async zipUrl(path, metadata = {}, params = {}) {
        params = Object.assign(this.params, params);
        if (params.downloadUrl) {
            params.apiUrl = params.downloadUrl;
        }
        const fileName = path.split('/').pop();
        const url = await this.url(path, metadata, params);
        url.set('pathname', url.pathname + '~arch/' + fileName + '.zip');
        return url;
    }

    stats(path, onMessage, metadata = {}, params = {}) {
        params = Object.assign(this.params, params);
        const url = `${params.apiUrl}/${this.infoHash}`;
        debug('get file stats infoHash=%s url=%s path=%s metadata=%o', this.infoHash, url, path, metadata);
        return stats(url, path, onMessage, metadata, params);
    }
}

export default function(params, sdk) {
    const self = {params, sdk};
    return {
        get(infoHash, metadata = {}, params = {}) {
            params = Object.assign(self.params, params);
            return new WebSeeder(infoHash, params, self.sdk);
        },
    };
};