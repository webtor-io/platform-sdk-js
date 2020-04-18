import {AbuseStore} from '../../proto/abuse-store/abuse-store_pb_service';
import {PushRequest} from '../../proto/abuse-store/abuse-store_pb';
import {grpc} from '@improbable-eng/grpc-web';
import process from './process';
const debug = require('debug')('webtor:sdk:abuse');

export default function(params = {}) {
    const self = {params};
    return {
        push(abuse, metadata = {}, params = {}) {
            params = Object.assign(self.params, params);
            const url = params.apiUrl + '/abuse';
            debug('push abuse url=%s metadata=%o', url, metadata);
            const request = new PushRequest();
            request.setSubject(abuse.subject);
            request.setDescription(abuse.description);
            request.setInfohash(abuse.infohash);
            request.setFilename(abuse.filename);
            request.setEmail(abuse.email);
            request.setWork(abuse.work);
            request.setCause(abuse.cause);
            request.setSource(PushRequest.Source.FORM);
            const client = () => grpc.client(AbuseStore.Push, {
                host: url,
                // transport: grpc.WebsocketTransport(),
                debug: params.grpcDebug,
            });
            const onEnd = (res, resolve, reject) => {
                if (res === grpc.Code.OK) {
                    debug('abuse stored');
                    resolve();
                } else {
                    reject('failed to push abuse code=' + res);
                }
            }
            return process(client, request, null, onEnd, metadata, params);
        },
    };
};