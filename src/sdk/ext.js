const pathParse = require('path-parse');
const Url = require('url-parse');

export default function(params, sdk) {
    const self = {params, sdk};
    return {
        async url(extUrl, metadata = {}, params = {}) {
            params = Object.assign(self.params, params);
            const url = new Url(params.apiUrl);
            const fileName = pathParse(extUrl).base;
            const encodedUrl = encodeURIComponent(btoa(extUrl));
            const pathname = '/ext/' + encodedUrl + '/' + fileName;
            url.set('pathname', pathname);
            const query = await this.sdk.util.makeQuery(metadata, params);
            url.set('query', query);
            return url;
        },
        async streamSubtitleUrl(extUrl, viewSettings = {}, metadata = {}, params = {}) {
            const url = await this.url(extUrl, metadata, params);
            return this.sdk.util.streamSubtitleUrl(url, viewSettings);
        },
        async streamUrl(extUrl, viewSettings = {}, metadata = {}, params = {}) {
            let url = await this.url(extUrl, metadata, params);
            return self.sdk.util.streamUrl(url, viewSettings);
        },
        async mediaInfo(extUrl, viewSettings = {}, metadata = {}, params = {}) {
            const url = await this.url(extUrl, metadata, params);
            return await this.sdk.util.mediaInfo(url, viewSettings);
        },
        async openSubtitles(extUrl, metadata = {}, params = {}) {
            const url = await this.url(extUrl, metadata, params);
            return await this.sdk.util.openSubtitles(url);
        },
    };
};