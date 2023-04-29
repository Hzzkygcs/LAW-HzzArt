const {BaseAutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/BaseAutomaticallyHandledException");

class ServiceResponseException extends BaseAutomaticallyHandledException{
    constructor(serviceName="", statusCode = 400, reason = {}) {
        super("");
        this.serviceName = serviceName;
        this.statusCode = statusCode;
        this.reason = reason;
    }
}
module.exports.ServiceResponseException = ServiceResponseException;