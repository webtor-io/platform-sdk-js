import webtor from '@webtor/platform-sdk-js';

async function main() {
    const status = document.createElement('div');
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.innerHTML = 'loading...';
    document.body.appendChild(link);
    document.body.appendChild(status);

    const sdk = webtor({
        apiUrl: 'http://192.168.64.3:30749', // you should change this
    });

    const magnetUri = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10';

    const torrent = await sdk.magnet.fetchTorrent(magnetUri);

    const expire = 60*60*24;

    await sdk.torrent.push(torrent, expire);

    const seeder = sdk.seeder.get(torrent.infoHash);

    const filePath = torrent.files[5].path;

    const url = await seeder.streamUrl(filePath);

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