
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class InvalidBooleanFieldsException extends AutomaticallyHandledException{
    constructor(name="", message="") {
        super(message, StatusCodes.BAD_REQUEST);
        this.name = "InvalidBooleanFieldsException";
    }
}
module.exports.InvalidBooleanFieldsException = InvalidBooleanFieldsException;