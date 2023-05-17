
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class VideoTooLargeException extends AutomaticallyHandledException{
    constructor(estimated_required_frame_size) {
        super("Video is too large. Maximum 9000 frames.", StatusCodes.BAD_REQUEST, {
            estimated_required_frame_size: estimated_required_frame_size
        });
        this.name = "VideoTooLargeException";
    }
}
module.exports.VideoTooLargeException = VideoTooLargeException;
