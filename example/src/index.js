import webtor from '@webtor/platform-sdk-js';
import 'video.js/dist/video-js.css';
import videojs from 'video.js';
// import hls from 'videojs-contrib-hls';
const parseTorrent = require('parse-torrent');

async function main() {
    const links = document.querySelectorAll('a[data-magnet]');
    for (const l of links) {
        l.addEventListener('click', function (e) {
            const m = e.target.getAttribute('data-magnet');
            run(m);
            e.preventDefault();
            return false;
        });
    }
}

async function run(magnetUri) {
    const link = document.querySelector('#download');
    link.setAttribute('target', '_blank');
    link.innerHTML = 'loading...';
    const status = document.querySelector('#status')
    status.innerHTML = '';

    const sdk = webtor({
        apiUrl: 'http://127.0.0.1:32476', // you should change this
    });

    let torrent = parseTorrent(magnetUri);

    try {
        torrent = await sdk.torrent.pull(torrent.infoHash);
    } catch (e) {
        console.log(e);
        torrent = null;
    }

    if (!torrent) {
        torrent = await sdk.magnet.fetchTorrent(magnetUri);
    }

    const expire = 60*60*24;

    await sdk.torrent.push(torrent, expire);

    const seeder = sdk.seeder.get(torrent.infoHash);

    let filePath = null;

    for (const f of torrent.files) {
        if (sdk.util.getMediaType(f.path) == 'video') {
            filePath = f.path;
        }
    }

    const url = await seeder.streamUrl(filePath);

    const v = videojs("webtor");
    v.src({
        src: url.toString(),
    });

    link.setAttribute('href', url.toString());
    link.innerHTML = filePath;

    // NOTE: stats will become available only after content url access
    seeder.stats(filePath, (path, data) => {
        console.log(data);
        status.innerHTML = 'total: ' + data.total;
        status.innerHTML += ' completed: ' + data.completed;
        status.innerHTML += ' peers: ' + data.peers;
    });
}

main();