
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class NotFoundException extends AutomaticallyHandledException{
    constructor(name="", message="") {
        super(message, StatusCodes.NOT_FOUND);
        this.name = "NotFoundException";
    }
}

module.exports.NotFoundException = NotFoundException;