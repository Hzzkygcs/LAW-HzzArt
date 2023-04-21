const {StatusCodes} = require("http-status-codes");
const {MESSAGE_RESPONSE_PROPERTY_NAME, ERROR_CODE_RESPONSE_PROPERTY_NAME} = require("../constants");


class AutomaticallyHandledException extends Error{
    constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
                additionalBody = {}) {
        super(message);
        this.name = "AutomaticallyHandledException";
        this.statusCode = statusCode;
        this.handled = false;
        this.additionalBody = additionalBody;
    }

    static fromResponse(statusCode, responseBody){
        responseBody = Object.assign({}, responseBody);
        const message = responseBody[MESSAGE_RESPONSE_PROPERTY_NAME];
        const exceptionClassName = responseBody[ERROR_CODE_RESPONSE_PROPERTY_NAME];

        delete responseBody[MESSAGE_RESPONSE_PROPERTY_NAME];
        delete responseBody[ERROR_CODE_RESPONSE_PROPERTY_NAME];
        const ret = new AutomaticallyHandledException(message, statusCode, responseBody);
        ret.name = exceptionClassName;
        return ret;
    }
}
module.exports.AutomaticallyHandledException = AutomaticallyHandledException;
