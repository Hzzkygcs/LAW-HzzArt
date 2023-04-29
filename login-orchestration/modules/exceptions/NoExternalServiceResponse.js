
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class NoExternalServiceResponse extends AutomaticallyHandledException{
    constructor(serviceName = "External", message="") {
        if (message === ""){
            message = `No response from ${serviceName} service.`;
        }

        super(message, StatusCodes.REQUEST_TIMEOUT);
        this.name = "NoExternalServiceResponse";
    }
}
module.exports.NoExternalServiceResponse = NoExternalServiceResponse;