
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class InvalidPasswordException extends AutomaticallyHandledException{
    constructor(message="") {
        super(message, StatusCodes.UNAUTHORIZED);
        this.name = "InvalidPasswordException";
    }
}
module.exports.InvalidPasswordException = InvalidPasswordException;