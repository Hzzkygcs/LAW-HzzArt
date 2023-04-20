
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class InvalidJWT extends AutomaticallyHandledException{
    constructor(name="", message="") {
        super(message, StatusCodes.UNAUTHORIZED);
        this.name = "InvalidJWTException";
    }
}

module.exports.InvalidJWTException = InvalidJWT;