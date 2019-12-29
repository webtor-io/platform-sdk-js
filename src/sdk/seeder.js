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
        const url = new Url(params.apiUrl);
        const pathname = '/' + this.infoHash + '/' + encodeURIComponent(path);
        url.set('pathname', pathname);
        const query = metadata;
        const token = await params.getToken();
        if (token) query.token = token;
        url.set('query', query);
        return url;
    }

    hls(url, viewSettings = {}, playlist) {
        let extra = '';
        if (viewSettings.a) {
            extra += 'a' + viewSettings.a;
        }
        if (viewSettings.s) {
            extra += 's' + viewSettings.s;
        }
        if (extra) extra = ':' + extra;
        url.set('pathname', url.pathname + '~hls' + extra + '/' + playlist);
        return url;
    }

    vtt(url) {
        url.set('pathname', url.pathname + '~vtt');
        return url;
    }

    vi(url, path) {
        url.set('pathname', url.pathname + '~vi' + path);
        return url;
    }

    async streamSubtitleUrl(path, viewSettings = {}, metadata = {}, params = {}) {
        const deliveryType = this.sdk.util.getDeliveryType(path);
        const mediaType = this.sdk.util.getMediaType(path);
        if (mediaType != 'video' || deliveryType != 'transcode') return;
        const url = await this.url(path, metadata, params);
        return this.hls(url, viewSettings, 'index_vtt.m3u8');
    }

    async streamUrl(path, viewSettings = {}, metadata = {}, params = {}) {
        let url = await this.url(path, metadata, params);
        const deliveryType = this.sdk.util.getDeliveryType(path);
        const mediaType = this.sdk.util.getMediaType(path);
        if (deliveryType == 'transcode') {
            if (mediaType == 'subtitle') {
                url = this.vtt(url);
            } else {
                url = this.hls(url, viewSettings, 'index.m3u8');
            }
        }
        return url;
    }

    async mediaInfo(path, metadata = {}, params = {}) {
        const deliveryType = this.sdk.util.getDeliveryType(path);
        const mediaType = this.sdk.util.getMediaType(path);
        if (deliveryType == 'webseed' || mediaType == 'subtitle') return {};
        const url = await this.url(path, metadata, params);
        url.set('pathname', url.pathname + '~hls/index.json');
        debug('get media info infoHash=%s url=%s path=%s metadata=%o', this.infoHash, url.toString(), path, metadata);
        const res = await(fetch(url));
        const mediaInfo = await res.json();
        debug('got mediaInfo=%o', mediaInfo);
        return mediaInfo;
    }

    async openSubtitles(path, metadata = {}, params = {}) {
        const mediaType = this.sdk.util.getMediaType(path);
        if (mediaType != 'video') return {};
        let url = await this.url(path, metadata, params);
        url = this.vi(url, '/subtitles.json');
        debug('get open subtitiles infoHash=%s url=%s path=%s metadata=%o', this.infoHash, url.toString(), path, metadata);
        const res = await(fetch(url));
        const data = await res.json();

        for (const k in data) {
            const format = data[k].format; 
            if (format != 'srt' && format != 'vtt') continue;
            let src = data[k].src;
            let url = await this.url(path, metadata, params);
            url = this.vi(url, src);
            if (format != 'vtt') {
                url = this.vtt(url);
            }
            data[k].src = url
        }
        debug('got open subtitiles=%o', data);
        return data;
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