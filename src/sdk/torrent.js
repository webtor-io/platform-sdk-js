import {TorrentStore} from '../../proto/torrent-store/torrent-store_pb_service';
import {PullRequest, PushRequest, TouchRequest} from '../../proto/torrent-store/torrent-store_pb';
import {grpc} from '@improbable-eng/grpc-web';
import process from './process';
import parseTorrent from 'parse-torrent';
const debug = require('debug')('webtor:sdk:torrent');

export default function(params = {}) {
    const self = {params};
    return {
        fromUrl(url) {
            debug('fetch torrent from url=%s', url);
            return new Promise((resolve, reject) => {
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
                xhr.open('GET', url);
                xhr.responseType = 'arraybuffer';
                xhr.send();
            });
        },
        pull(infoHash, metadata = {}, params = {}) {
            params = Object.assign(self.params, params);
            const url = params.apiUrl + params.endpoints.torrent;
            debug('pull torrent infoHash=%s url=%s metadata=%o', infoHash, url, metadata);
            const request = new PullRequest();
            request.setInfohash(infoHash);
            const client = () => grpc.client(TorrentStore.Pull, {
                host:  url,
                // transport: grpc.WebsocketTransport(),
                debug: params.grpcDebug,
            });
            const onMessage = (message, resolve, reject) => {
                if (message.torrent == '') {
                    return reject('no torrent');
                }
                let torrent = Buffer.from(message.torrent, 'base64');
                torrent = parseTorrent(torrent);
                debug('and finally torrent=%o', torrent);
                resolve(torrent);
            }
            const onEnd = (res, resolve, reject) => {
                if (res == grpc.Code.PermissionDenied) {
                    reject('abused');
                } else if (res !== grpc.Code.OK) {
                    reject('failed to pull torrent code=' + res);
                }
            }
            return process(client, request, onMessage, onEnd, metadata, params);
        },
        push(torrent, expire, metadata = {}, params = {}) {
            params = Object.assign(self.params, params);
            const url = params.apiUrl + params.endpoints.torrent;
            debug('push torrent url=%s metadata=%o', url, metadata);
            const request = new PushRequest();
            request.setTorrent(parseTorrent.toTorrentFile(torrent));
            const client = () => grpc.client(TorrentStore.Push, {
                host:  url,
                // transport: grpc.WebsocketTransport(),
                debug: params.grpcDebug,
            });
            const onEnd = (res, resolve, reject) => {
                if (res === grpc.Code.OK) {
                    debug('torrent stored');
                    resolve();
                } else if (res === grpc.Code.NotFound) {
                    reject('not found');
                } else if (res === grpc.Code.PermissionDenied) {
                    reject('abused');
                } else {
                    reject('failed to push torrent code=' + res);
                }

            }
            return process(client, request, null, onEnd, metadata, params);
        },
        touch(torrent, expire, metadata = {}, params = {}) {
            params = Object.assign(self.params, params);
            const url = params.apiUrl + params.endpoints.torrent;
            debug('touch torrent url=%s metadata=%o', url, metadata);
            const request = new TouchRequest();
            request.setInfohash(torrent.infoHash);
            const client = () => grpc.client(TorrentStore.Touch, {
                host: url,
                // transport: grpc.WebsocketTransport(),
                debug: params.grpcDebug,
            });
            const onEnd = (res, resolve, reject) => {
                if (res === grpc.Code.OK) {
                    debug('torrent touched');
                    resolve();
                } else if (res === grpc.Code.PermissionDenied) {
                    reject('abused');
                } else if (res === grpc.Code.NotFound) {
                    reject('not found');
                } else {
                    reject('failed to touch torrent code=' + res);
                }
            }
            return process(client, request, null, onEnd, metadata, params);
        },
    };
}