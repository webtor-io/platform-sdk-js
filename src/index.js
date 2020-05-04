import _ from 'lodash';
import torrent from './sdk/torrent';
import magnet from './sdk/magnet';
import abuse from './sdk/abuse';
import seeder from './sdk/seeder';
import util from './sdk/util';
import ext from './sdk/ext';

const defaultParams = {
    grpcDebug: false,
    retryInterval: 1000,
    retryLimit: 3,
    cache: false,
    async getToken() {
        return null;
    },
}

function sdk(params = {}) {
    params = Object.assign(defaultParams, params);
    if (params.tokenUrl) {
        params.getToken = async () => {
            const res = await fetch(params.tokenUrl);
            return res.text();
        }
    }
    if (params.tokenRenewInterval) {
        const t = params.getToken;
        params.getToken = _.throttle(t, params.tokenRenewInterval, {
            trailing: false,
        });
    }

    let sdk = {};

    sdk = Object.assign(sdk, {
        seeder:  seeder(params, sdk),
        ext:     ext(params, sdk),
        magnet:  magnet(params, sdk),
        torrent: torrent(params, sdk),
        abuse:   abuse(params, sdk),
        util:    util(params, sdk),
    });

    return sdk;

};

export default function(params = {}) {
    return sdk(params);
}