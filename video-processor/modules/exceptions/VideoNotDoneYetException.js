
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class VideoNotDoneYetException extends AutomaticallyHandledException{
    constructor(tokenName, progress) {
        super("Video is currently in progress", StatusCodes.NOT_FOUND, {
            token: tokenName,
            progress: progress
        });
        this.name = "VideoNotDoneYetException";
    }
}
module.exports.VideoNotFinishedYetException = VideoNotDoneYetException;
