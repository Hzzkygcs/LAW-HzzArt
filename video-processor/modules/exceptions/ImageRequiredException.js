
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class ImageRequiredException extends AutomaticallyHandledException{
    constructor() {
        super("Please give at least one valid image", StatusCodes.BAD_REQUEST, {
        });
        this.name = "ImageRequiredException";
    }
}
module.exports.ImageRequiredException = ImageRequiredException;
