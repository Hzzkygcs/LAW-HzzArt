const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

console.log("FFMPEG VERSION ", ffmpegInstaller.version);
console.log("FFMPEG VERSION ", ffmpegInstaller.version);


module.exports.getFfmpeg = function () {
    return ffmpeg();
}

module.exports.getFfmpegPath = function () {
    return ffmpegInstaller.path;
}


module.exports.getFfmpegWithInput = function (input) {
    return ffmpeg(input);
}