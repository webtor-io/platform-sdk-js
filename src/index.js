import torrent from './sdk/torrent';
import magnet from './sdk/magnet';
import abuse from './sdk/abuse';
import seeder from './sdk/seeder';
import tracker from './sdk/tracker';
import loader from './sdk/loader';
import util from './sdk/util';
import ext from './sdk/ext';
import throttle from 'lodash/throttle';

const defaultParams = {
    db: null,
    grpcDebug: false,
    retryInterval: 1000,
    retryLimit: 3,
    cache: false,
    multibitrate: false,
    vod: false,
    pools: {
        cache: [],
        seeder: [],
        transcoder: [],
    },
    subdomains: false,
    async getToken() {
        return null;
    },
    endpoints: {
        torrent: '/store'
    },
    tokenRenewInterval: 60000,
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
        params.getToken = throttle(t, params.tokenRenewInterval, {
            trailing: false,
        });
    }

    let sdk = {};

    sdk = Object.assign(sdk, {
        params,
        tracker: tracker(params, sdk),
        seeder:  seeder(params, sdk),
        ext:     ext(params, sdk),
        magnet:  magnet(params, sdk),
        torrent: torrent(params, sdk),
        abuse:   abuse(params, sdk),
        util:    util(params, sdk),
        loader:  loader(params, sdk),
    });
    sdk.load = (source, metadata = {}, params = {}) => {
        return sdk.loader.load(source, metadata, params);
    };
    sdk.loadById = (type, id, metadata = {}, params = {}) => {
        return sdk.loader.loadById(type, id, metadata, params);
    };

    return sdk;

};

export default function(params = {}) {
    return sdk(params);
}