const ffmpeg = require('fluent-ffmpeg');


module.exports.get_ffmpeg = function () {
    return ffmpeg();
}


module.exports.get_ffmpeg_with_input = function (input) {
    return ffmpeg(input);
}