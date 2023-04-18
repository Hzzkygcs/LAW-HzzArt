
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class InvalidTokenException extends AutomaticallyHandledException{
    constructor(name="", message="") {
        super(message, StatusCodes.UNAUTHORIZED);
        this.name = "InvalidTokenException";
    }
}

module.exports.InvalidTokenException = InvalidTokenException;