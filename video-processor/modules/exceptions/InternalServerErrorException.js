
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class InternalServerErrorException extends AutomaticallyHandledException{
    constructor(msg) {
        super("Internal server error happened", StatusCodes.BAD_REQUEST, {
            msg: msg
        });
        this.name = "InternalServerErrorException";
    }
}
module.exports.InternalServerErrorException = InternalServerErrorException;
