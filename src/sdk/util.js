const path = require('path');
const Url = require('url-parse');
import ISO6391 from 'iso-639-1';
import mime from 'mime';
const debug = require('debug')('webtor:sdk:util');
const debugFetch = function(url) {
    debug('fetch url=%o', url.href);
    return fetch(url);
}
const retryFetch = require('fetch-retry')(debugFetch, {
    retries: 3,
    retryDelay: function(attempt, error, response) {
        return Math.pow(2, attempt) * 1000;
    },
    retryOn: function(attempt, error, response) {
        if (error !== null || response.status >= 500) {
            debug('got fetch error retry count=%o', attempt);
            return true;
        }
    },
});

function cleanExt(ext) {
    return ext.replace(/~[a-z0-9]+$/, '');
}

export default function(params, sdk) {
    const self = {params, sdk};
    return {
        async makeQuery(metadata = {}, params = {}) {
            params = Object.assign(self.params, params);
            metadata = Object.assign({}, metadata);
            const query = metadata;
            const token = await params.getToken();
            if (token) query.token = token;
            if (params.apiKey) query["api-key"] = params.apiKey;
            return query;
        },
        getDeliveryType(file) {
            if (!file) return;
            let ext = path.extname(file);
            ext = cleanExt(ext);
            // Browser unsupported streaming formats
            if ('.avi .mkv .flac .m4a .m4v'.split(' ').includes(ext)) return 'transcode';
            // Browser supported streaming formats
            if ('.mp4 .mp3 .wav .ogg .webm'.split(' ').includes(ext)) return 'webseed';
            // Browser supported image formats
            if ('.png .gif .jpg .jpeg'.split(' ').includes(ext)) return 'webseed';
            // Browser unsupported subtitle formats
            if ('.vtt'.split(' ').includes(ext)) return 'webseed';
            if ('.srt'.split(' ').includes(ext)) return 'transcode';
        },
        getMediaType(file) {
            if (!file) return;
            let ext = path.extname(file);
            ext = cleanExt(ext);
            // Video
            if ('.avi .mkv .mp4 .webm .m4v'.split(' ').includes(ext)) return 'video';
            // Audio
            if ('.mp3 .wav .ogg .flac .m4a'.split(' ').includes(ext)) return 'audio';
            // Images
            if ('.png .gif .jpg .jpeg'.split(' ').includes(ext)) return 'image';
            // Subtitles
            if ('.srt .vtt'.split(' ').includes(ext)) return 'subtitle';
        },
        getMimeType(url) {
            const ext = path.extname(url.pathname);
            return mime.getType(ext);
        },
        getSubtitleSrcLang(name) {
            const baseName = path.basename(name, path.extname(name));
            for (const code of ISO6391.getAllCodes()) {
                if (baseName.endsWith('.' + code)) return code;
            }
            return false;
        },
        getSubtitleLang(name) {
            const code = this.getSubtitleSrcLang(name);
            if (code == false) return false;
            return this.getLang(code);
        },
        getLang(code) {
            return {
                code,
                name: ISO6391.getName(code),
                nativeName: ISO6391.getNativeName(code),
            };
        },
        cloneUrl(url) {
            return new Url(url.toString());
        },
        vttUrl(url) {
            url = this.cloneUrl(url);
            url.set('pathname', url.pathname + '~vtt');
            return url;
        },
        tcUrl(url) {
            url = this.cloneUrl(url);
            url.set('pathname', url.pathname + '~tc');
            return url;
        },
        hlsUrl(url, viewSettings = {}, playlist) {
            url = this.cloneUrl(url);
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
        },
        viUrl(url, path) {
            url = this.cloneUrl(url);
            url.set('pathname', url.pathname + '~vi' + path);
            return url;
        },
        streamUrl(url, viewSettings = {}) {
            url = this.cloneUrl(url);
            const deliveryType = this.getDeliveryType(url.pathname);
            const mediaType = this.getMediaType(url.pathname);
            if (deliveryType == 'transcode') {
                if (mediaType == 'subtitle') {
                    url = this.vttUrl(url);
                } else {
                    url = this.hlsUrl(url, viewSettings, 'index.m3u8');
                }
            }
            return url;
        },
        streamSubtitleUrl(url, viewSettings = {}) {
            url = this.cloneUrl(url);
            const deliveryType = this.getDeliveryType(url.pathname);
            const mediaType = this.getMediaType(url.pathname);
            if (mediaType != 'video' || deliveryType != 'transcode') return;
            return this.hlsUrl(url, viewSettings, 'index_vtt.m3u8');
        },

        async mediaInfo(url, viewSettings = {}) {
            url = this.cloneUrl(url);
            const deliveryType = this.getDeliveryType(url.pathname);
            const mediaType = this.getMediaType(url.pathname);
            if (deliveryType == 'webseed' || mediaType == 'subtitle') return {};
            url = this.hlsUrl(url, viewSettings, 'index.json');
            const res = await(retryFetch(url));
            const mediaInfo = await res.json();
            return mediaInfo;
        },
        async openSubtitles(url) {
            url = this.cloneUrl(url);
            const mediaType = this.getMediaType(url.pathname);
            if (mediaType != 'video') return {};
            const subtitlesUrl = this.viUrl(url, '/subtitles.json');
            const res = await(retryFetch(subtitlesUrl));
            const data = await res.json();

            for (const k in data) {
                const format = data[k].format; 
                if (format != 'srt' && format != 'vtt') continue;
                let src = data[k].src;
                let sUrl = this.viUrl(url, src);
                if (format != 'vtt') {
                    sUrl = this.vttUrl(sUrl);
                }
                data[k].src = sUrl
            }
            return data;
        }
    };
}