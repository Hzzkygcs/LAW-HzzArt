const ffmpeg = require('fluent-ffmpeg');


module.exports.getFfmpeg = function () {
    return ffmpeg();
}


module.exports.getFfmpegWithInput = function (input) {
    return ffmpeg(input);
}