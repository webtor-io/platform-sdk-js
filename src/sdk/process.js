import {grpc} from '@improbable-eng/grpc-web';

const debug = require('debug')('webtor:sdk');

export default async function(client, request, onMessage, onEnd, metadata = {}, params = {}) {
    metadata['token'] = await params.getToken();
    metadata['api-key'] = params.apiKey;
    return new Promise(function(resolve, reject) {
        function process() {
            const c = client();
            if (onMessage) {
                c.onMessage((message) => {
                    debug('got message=%o', message.toObject());
                    onMessage(message.toObject(), resolve, reject);
                });
            }
            if (onEnd) {
                c.onEnd(async (res) => {
                    if (res == grpc.Code.Unknown && params.grpcRetryInterval) {
                        debug('failed to get process request error=%o retry', res);
                        await (new Promise(resolve => setTimeout(resolve, params.grpcRetryInterval)));
                        process();
                    } else {
                        onEnd(res, resolve, reject);
                    }
                });
            }
            c.start(new grpc.Metadata(metadata));
            c.send(request);
            c.finishSend();
        }
        process();
    });
}
