const path = require('path');
const Url = require('url-parse');
import ISO6391 from 'iso-639-1';
import mime from 'mime';
import { readSync } from 'fs';
var md5 = require('md5');
// const _ = require('lodash')
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
    return ext.toLowerCase().replace(/~[a-z0-9]+$/, '');
}
function cleanPath(p) {
    return p.replace(/\/\//, '/');
}
function buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

export default function(params, sdk) {
    const self = {params, sdk};
    const throttledFuncs = {};
    const util = {
        async makeQuery(metadata = {}, params = {}) {
            params = Object.assign({}, self.params, params);
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
            if ('.avi .mkv .flac .m4a .m4v .ts .vob'.split(' ').includes(ext)) return 'transcode';
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
            if ('.avi .mkv .mp4 .webm .m4v .ts .vob'.split(' ').includes(ext)) return 'video';
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
            return Object.assign(new Url(), url);
        },
        vttUrl(url) {
            url = this.cloneUrl(url);
            url.set('pathname', cleanPath(url.pathname + '~vtt/' + encodeURIComponent(path.basename(url.pathname))));
            return url;
        },
        completedPiecesUrl(url) {
            url = this.cloneUrl(url);
            url = this.tcUrl(url);
            url.set('pathname', cleanPath(url.pathname.replace(/~tc.*$/, '~tc/completed_pieces')));
            return url;
        },
        transcodeDoneMarkerUrl(url) {
            url = this.cloneUrl(url);
            url.set('pathname', cleanPath(url.pathname + '~trc/done'));
            return url;
        },
        transcodeIndexUrl(url) {
            url = this.cloneUrl(url);
            url.set('pathname', cleanPath(url.pathname + '~trc/index.m3u8'));
            return url;
        },
        pieceUrl(url, id) {
            url = this.cloneUrl(url);
            url.set('pathname', cleanPath(url.pathname + '/piece/' + id));
            return url;
        },
        tcUrl(url) {
            url = this.cloneUrl(url);
            if (url.pathname.includes('~tc')) return url;
            url.set('pathname', cleanPath(url.pathname + '~tc/' + encodeURIComponent(path.basename(url.path))));
            return url;
        },
        hlsUrl(url, file) {
            url = this.cloneUrl(url);
            url.set('pathname', cleanPath(url.pathname + '~hls/' + file));
            return url;
        },
        trcUrl(url, file) {
            url = this.cloneUrl(url);
            url.set('pathname', cleanPath(url.pathname + '~trc/' + file));
            return url;
        },
        vodUrl(url, file) {
            url = this.cloneUrl(url);
            url.set('pathname', cleanPath(url.pathname + '~vod/hls/' + md5(cleanPath(url.pathname)) + '/' + file));
            return url;
        },
        viUrl(url, path) {
            url = this.cloneUrl(url);
            url.set('pathname', cleanPath(url.pathname + '~vi' + path));
            return url;
        },
        async baseStreamUrl(url, file, metadata, params, context) {
            url = this.cloneUrl(url);
            const deliveryType = this.getDeliveryType(url.pathname);
            const mediaType = this.getMediaType(url.pathname);
            if (params.vod && cleanExt(path.extname(url.pathname)) == '.mp4') {
                return this.vodUrl(url, file);
            } else if (deliveryType == 'transcode') {
                if (mediaType == 'subtitle') {
                    return this.vttUrl(url)
                }
                if (params.cache) {
                    const done = await this.throttledTranscodeDoneMarker(url, metadata, params);
                    if (done) {
                        return this.trcUrl(url, file);
                    }
                }
                return this.hlsUrl(url, file);
            }
            return url;
        },
        async streamUrl(url, metadata, params, context) {
            return this.baseStreamUrl(url, 'index.m3u8', metadata, params, context);
        },
        async segmentUrl(url, segment, metadata, params, context) {
            return this.baseStreamUrl(url, segment, metadata, params, context);
        },

        async transcodeDoneMarker(url) {
            url = this.cloneUrl(url);
            url = this.transcodeDoneMarkerUrl(url);
            const res = await(retryFetch(url));
            return res.status == 200;
        },

        async transcodeIndexExists(url) {
            url = this.cloneUrl(url);
            url = this.transcodeIndexUrl(url);
            const res = await(retryFetch(url));
            return res.status == 200;
        },

        async completedPieces(url) {
            url = this.cloneUrl(url);
            url = this.completedPiecesUrl(url);
            const res = await(retryFetch(url));
            const buf = await res.arrayBuffer();
            const byteArr = new Uint8Array(buf);
            const hex = buf2hex(byteArr);
            const pieces = [];
            let p = '';
            for (const c of hex) {
                p += c;
                if (p.length == 40) {
                    pieces.push(p);
                    p = '';
                }
            }
            return pieces;
        },

        async mediaInfo(url) {
            url = this.cloneUrl(url);
            const deliveryType = this.getDeliveryType(url.pathname);
            const mediaType = this.getMediaType(url.pathname);
            if (deliveryType == 'webseed' || mediaType == 'subtitle') return {};
            url = this.hlsUrl(url, 'index.json');
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
        },
        async subdomainsUrl(metadata = {}, params = {}) {
            params = Object.assign({}, self.params, params);
            const url = new Url(params.apiUrl);
            const pathname = '/subdomains.json';
            url.set('pathname', pathname);
            const query = await self.sdk.util.makeQuery(metadata, params);
            url.set('query', query);
            return url;
        },
        async subdomains(u, path, metadata = {}, params = {}) {
            params = Object.assign({}, self.params, params);
            const url = await this.subdomainsUrl(metadata, params);
            const res = await(debugFetch(url));
            const s = await res.json();
            const rr = [];
            for (const e of s) {
                rr.push(e);
            }
            return rr;
        },
        isCDNAllowed(path, params = {}) {
            params = Object.assign({}, self.params, params);
            for (const a of params.cdnPathSuffixes) {
                if (cleanExt(path).endsWith(a)) return true;
            }
            return false;
        },
        cdnUrl(url, params = {}) {
            url = this.cloneUrl(url);
            params = Object.assign({}, self.params, params);
            if (params.cdnUrl && this.isCDNAllowed(url.pathname, params)) {
                let cdnUrl = new Url(params.cdnUrl);
                url.set('hostname', cdnUrl.hostname);
                url.set('protocol', cdnUrl.protocol);
                url.set('query', '?api-key=' + params.apiKey);
                return url;
            }
            return false;
        },
        async throttled(func, interval, url, file, metadata, params) {
            const key = url.infoHash + file + func.name;
            if (!throttledFuncs[key]) {
                throttledFuncs[key] = _.throttle(_.bind(func, this), interval, {
                    trailing: false,
                });
            }
            const tf = throttledFuncs[key];
            return await tf(url, file, metadata, params);
        },
        async cacheUrl(url, metadata, params) {
            const completedPieces = await this.throttledCompletedPieces(url, metadata, params);
            if (completedPieces.length > 0) {
                return this.tcUrl(url);
            }
            return url;

        },
        async throttledCompletedPieces(url, metadata = {}, params = {}) {
            let completedPieces = [];
            if (params.cache) {
                completedPieces = await this.throttled(this.completedPieces, 10*60*1000, url, null, metadata, params);
            }
            return completedPieces;
        },
        async throttledTranscodeIndexExists(url, metadata = {}, params = {}) {
            let done = false;
            if (params.cache) {
                done = await this.throttled(this.transcodeIndexExists, 10*60*1000, url, url.path, metadata, params);
            }
            return done;
        },
        async throttledTranscodeDoneMarker(url, metadata = {}, params = {}) {
            let done = false;
            if (params.cache) {
                done = await this.throttled(this.transcodeDoneMarker, 10*60*1000, url, url.path, metadata, params);
            }
            return done;
        },
        async isCached(url, metadata = {}, params = {}) {
            const completedPieces = await this.throttledCompletedPieces(url, metadata, params);
            let cached = completedPieces.length > 0;
            const deliveryType = this.getDeliveryType(url.pathname);
            const mediaType = this.getMediaType(url.pathname);
            if (mediaType != 'subtitle' && deliveryType == 'transcode') {
                cached = await this.throttledTranscodeDoneMarker(url, metadata, params);
            }
            return cached;
        },
        async subdomainUrl(url, metadata = {}, params = {}, context = {}) {
            url = this.cloneUrl(url);
            params = Object.assign({}, self.params, params);
            if (!params.useSubdomains || !params.subdomains) {
                return url;
            }
            try {
                const cached = await this.isCached(url, metadata, params);
                const subdomains = await this.throttled(this.subdomains, 30*1000, url, null, Object.assign({}, metadata, {
                    'skip-active-job-search': cached,
                }), params);
                if (!context.usedSubdomains) context.usedSubdomains = [];
                const sub = subdomains.filter(e => !context.usedSubdomains.includes(e));
                if (sub.length > 0) {
                    const s = sub[0];
                    url.set('hostname', s + '.' + url.hostname);
                    context.usedSubdomains.push(s);
                }
            } catch (e) {
                debug(e);
                console.log(e);
                return false;
            }
            return url;
        }
    };
    return util;
}