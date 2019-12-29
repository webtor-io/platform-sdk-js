import {grpc} from '@improbable-eng/grpc-web';

const debug = require('debug')('webtor:sdk');

export default async function(client, request, onMessage, onEnd, metadata = {}, params = {}) {
    metadata['token'] = await params.getToken();
    return new Promise(function(resolve, reject) {
        if (onMessage) {
            client.onMessage((message) => {
                debug('got message=%o', message.toObject());
                onMessage(message.toObject(), resolve, reject);
            });
        }
        if (onEnd) {
            client.onEnd((res) => {
                onEnd(res, resolve, reject);
            });
        }
        client.start(new grpc.Metadata(metadata));
        client.send(request);
        client.finishSend();
    });
}
