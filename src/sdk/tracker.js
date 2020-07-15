const Url = require('url-parse');

export default function(params, sdk) {
    const self = {params, sdk};
    return {
        async url(metadata = {}, params = {}) {
            params = Object.assign(self.params, params);
            const url = new Url(params.apiUrl);
            const pathname = '/tracker/';
            url.set('pathname', pathname);
            url.set('protocol', 'wss:');
            const query = await self.sdk.util.makeQuery(metadata, params);
            url.set('query', query);
            return url;
        },
    };
};