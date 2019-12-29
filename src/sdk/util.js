const path = require('path');
import mime from 'mime';

export default function() {
    return {
        getDeliveryType(file) {
            if (!file) return;
            const ext = path.extname(file);
            // Browser unsupported streaming formats
            if ('.avi .mkv .flac .m4a .m4v'.split(' ').includes(ext)) return 'transcode';
            // Browser supported streaming formats
            if ('.mp4 .mp3 .wav .ogg .webm'.split(' ').includes(ext)) return 'webseed';
            // Browser supported image formats
            if ('.png .gif .jpg .jpeg'.split(' ').includes(ext)) return 'webseed';
            // Browser unsupported subtitle formats
            if ('.vtt'.split(' ').includes(ext)) return 'webseed';
            if ('.srt'.split(' ').includes(ext)) return 'transcode';
        },
        getMediaType(file) {
            if (!file) return;
            const ext = path.extname(file);
            // Video
            if ('.avi .mkv .mp4 .webm .m4v'.split(' ').includes(ext)) return 'video';
            // Audio
            if ('.mp3 .wav .ogg .flac .m4a'.split(' ').includes(ext)) return 'audio';
            // Images
            if ('.png .gif .jpg .jpeg'.split(' ').includes(ext)) return 'image';
            // Subtitles
            if ('.srt .vtt'.split(' ').includes(ext)) return 'subtitle';
        },
        getMimeType(url) {
            const ext = path.extname(url.pathname);
            return mime.getType(ext);
        },
    };
}