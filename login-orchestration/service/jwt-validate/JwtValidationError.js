const {AutomaticallyHandledException} = require("../../modules/global-route-exceptions-handler/exceptions/AutomaticallyHandledException");
const {StatusCodes} = require("http-status-codes");

class JwtValidationError extends AutomaticallyHandledException {

    constructor(name="", message="") {
        super(message, StatusCodes.UNAUTHORIZED);
        this.name = "JsonWebTokenValidationError";
        this.additionalBody = {
            jwtErrorCode: name
        }
    }

    static from(error){
        const name = error.name;
        const message = error.message;
        return new JwtValidationError(name, message);
    }
}
module.exports.JwtValidationError = JwtValidationError;