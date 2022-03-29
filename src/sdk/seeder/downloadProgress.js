import {DownloadProgress} from  '../../../proto/download-progress/download-progress_pb_service';
import {StatRequest, StatReply} from '../../../proto/download-progress/download-progress_pb';
import {grpc} from '@improbable-eng/grpc-web';
import process from '../process';
const debug = require('debug')('webtor:sdk:seeder:downloadProgress');
import invert from 'lodash/invert';

class Stats {
    constructor(url, path) {
        this.url = url;
        this.path = path;
        this.closed = false;
        this.client = null;
    }
    close() {
        if (this.closed) return;
        this.closed = true;
        debug('close download progress url=%o path=%o', this.url, this.path);
        if (this.client) this.client.close();
    }
    start(onMessage, onEnd, metadata, params) {
        const request = new StatRequest();
        const client = () => { 
            const c = grpc.client(DownloadProgress.StatStream, {
                host: this.url,
                transport: grpc.WebsocketTransport(),
                debug: params.grpcDebug,
            });
            this.client = c;
            return c;
        };
        const statuses = invert(StatReply.Status);
        const onMessageWrapper = (message) => {
            message.statusName = statuses[message.status];
            onMessage(this.path, message);
        }
        const onEndWrapper = (res, resolve, reject) => {
            if (res !== grpc.Code.OK) {
                reject('failed to get download progress code=' + res);
            } else {
                debug('download progress finished url=%o path=%o', this.url, this.path);
                this.close();
                resolve();
            }
            onEnd(this.path, res);
        }

        return process(client, request, onMessageWrapper, onEndWrapper, metadata, params);
    }
}

export default function(url, path, onMessage, onEnd, metadata = {}, params = {}) {
    const st = new Stats(url, path);
    st.start(onMessage, onEnd, metadata, params);
    return st;
}