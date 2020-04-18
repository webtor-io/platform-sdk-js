import {Magnet2Torrent} from '../../proto/magnet2torrent/magnet2torrent_pb_service';
import {Magnet2TorrentRequest} from '../../proto/magnet2torrent/magnet2torrent_pb';
import {grpc} from '@improbable-eng/grpc-web';
import process from './process';
import parseTorrent from 'parse-torrent';
const debug = require('debug')('webtor:sdk:magnet');

export default function(params = {}) {
    const self = {params};
    return {
        fetchTorrent(magnet, metadata = {}, params = {}) {
            params = Object.assign(self.params, params);
            const url = params.apiUrl + '/magnet2torrent';
            debug('fetch torrent magnet=%s url=%s metadata=%o', magnet, url, metadata);
            const request = new Magnet2TorrentRequest();
            request.setMagnet(magnet);
            const client = () => grpc.client(Magnet2Torrent.Magnet2Torrent, {
                host:      url,
                transport: grpc.WebsocketTransport(),
                debug:     params.grpcDebug,
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
                if (res !== grpc.Code.OK) {
                    reject('failed to fetch torrent code=' + res);
                }
            }
            return process(client, request, onMessage, onEnd, metadata, params);
        },
    };
};