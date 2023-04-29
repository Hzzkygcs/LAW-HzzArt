const {StatusCodes} = require("http-status-codes");
const {BaseAutomaticallyHandledException} = require("./BaseAutomaticallyHandledException");


class AutomaticallyHandledException extends Error{
    constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
                additionalBody = {}) {
        super(message);
        this.name = "AutomaticallyHandledException";
        this.statusCode = statusCode;
        this.handled = false;
        this.additionalBody = additionalBody;
    }
}
module.exports.AutomaticallyHandledException = AutomaticallyHandledException;
