const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("./global-route-exceptions-handler/exceptions/AutomaticallyHandledException");

class InvalidJsonSyntax extends AutomaticallyHandledException{
    constructor(message) {
        super(message, StatusCodes.BAD_REQUEST);
        this.name = "InvalidJsonSyntax";
    }
}



function jsonInvalidSyntaxHandlerMiddleware(err, _req, _res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        next(new InvalidJsonSyntax("Invalid JSON syntax"));
    }
}

module.exports.jsonInvalidSyntaxHandlerMiddleware = jsonInvalidSyntaxHandlerMiddleware;