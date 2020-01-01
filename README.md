# platform-sdk-js
SDK for online torrent streaming

## Features
1. Online torrent content streaming without waiting for full download
2. On-the-fly content transcoding
3. Downloading torrent as ZIP-archive (coming soon)
4. Subtitle transcoding, srt to vtt (coming soon)

## Supported formats
* Video: avi, mkv, mp4, webm, m4v
* Audio: mp3, wav, ogg, flac, m4a
* Images: png, gif, jpg, jpeg
* Subtitles: srt, vtt

## Prerequisites
Before moving further we must be sure that webtor backend api is already installed.
Just follow [this guide](https://github.com/webtor-io/helm-charts) to setup all the things.

## Installation
```bash
npm install @webtor/platform-sdk-js
```
or
```bash
yarn add @webtor/platform-sdk-js
```

## Usage
Just a simple example of fetching torrent by magnet-uri, getting streaming url and stats:
```js
import webtor from '@webtor/platform-sdk-js';

const sdk = webtor({
  apiUrl: '...',
});

const magnetUri = '...';

const torrent = await sdk.magnet.fetchTorrent(magnetUri);

const expire = 60*60*24;

await sdk.torrent.push(torrent, expire);

const seeder = sdk.seeder.get(torrent.infoHash);

const filePath = torrent.files[0].path;

const url = await seeder.streamUrl(filePath);
console.log(url);

// NOTE: stats will become available only after content url access
seeder.stats(filePath, (path, data) => {
  console.log(data);
});
```
You can find fully working example [here](https://github.com/webtor-io/platform-sdk-js/tree/master/example)!
