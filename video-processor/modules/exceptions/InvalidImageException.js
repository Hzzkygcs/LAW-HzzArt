
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class InvalidImageException extends AutomaticallyHandledException{
    constructor(imageId="", mimeType="") {
        super(`Unsupported image format: ${mimeType}`, StatusCodes.BAD_REQUEST, {
            imageId: imageId,
            format: mimeType,
        });
        this.name = "InvalidImageException";
    }
}
module.exports.InvalidImageException = InvalidImageException;
