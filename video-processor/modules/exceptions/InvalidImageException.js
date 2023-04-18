
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class InvalidImageException extends AutomaticallyHandledException{
    constructor(imageId="") {
        super("Invalid image format", StatusCodes.BAD_REQUEST, {
            imageId: imageId
        });
        this.name = "InvalidImageException";
    }
}
module.exports.InvalidImageException = InvalidImageException;
