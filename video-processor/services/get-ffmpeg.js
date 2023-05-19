const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);



module.exports.getFfmpeg = function () {
    return ffmpeg();
}


module.exports.getFfmpegWithInput = function (input) {
    return ffmpeg(input);
}