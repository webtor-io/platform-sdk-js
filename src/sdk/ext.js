const pathParse = require('path-parse');
const Url = require('url-parse');

export default function(params, sdk) {
    const self = {params, sdk};
    return {
        async url(extUrl, metadata = {}, params = {}) {
            params = Object.assign(self.params, params);
            const url = new Url(params.apiUrl);
            let fileName = "";
            if (params.fileName) {
                fileName = params.fileName;
            } else {
                fileName = pathParse(extUrl).base;
            }
            const encodedUrl = encodeURIComponent(btoa(extUrl));
            const pathname = '/ext/' + encodedUrl + '/' + fileName;
            url.set('pathname', pathname);
            const query = await self.sdk.util.makeQuery(metadata, params);
            url.set('query', query);
            return url;
        },
        async streamSubtitleUrl(extUrl, metadata = {}, params = {}) {
            const url = await this.url(extUrl, metadata, params);
            return self.sdk.util.streamSubtitleUrl(url);
        },
        async streamUrl(extUrl, metadata = {}, params = {}) {
            params = Object.assign({}, this.params, params);
            let url = await this.url(extUrl, metadata, params);
            return self.sdk.util.streamUrl(url, metadata, params);
        },
        async mediaInfo(extUrl, metadata = {}, params = {}) {
            const url = await this.url(extUrl, metadata, params);
            return await self.sdk.util.mediaInfo(url);
        },
        async openSubtitles(extUrl, metadata = {}, params = {}) {
            const url = await this.url(extUrl, metadata, params);
            return await self.sdk.util.openSubtitles(url);
        },
    };
};