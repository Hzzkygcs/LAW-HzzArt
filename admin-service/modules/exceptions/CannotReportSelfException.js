const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");

class CannotReportSelfException extends AutomaticallyHandledException {
    constructor(name = "", message = "") {
        super(message, StatusCodes.BAD_REQUEST);
        this.name = "CannotReportSelfException";
    }
}

module.exports.CannotReportSelfException = CannotReportSelfException;