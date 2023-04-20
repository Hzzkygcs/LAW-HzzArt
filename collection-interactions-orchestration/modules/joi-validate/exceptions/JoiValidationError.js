const {AutomaticallyHandledException} = require("../../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");
const {StatusCodes} = require("http-status-codes");


class JoiValidationError extends AutomaticallyHandledException{
    constructor(name="", message="") {
        super(message, StatusCodes.BAD_REQUEST);
        this.name = "ValidationError";
        this.additionalBody = {
            joiErrorCode: name
        }
    }

    /**
     * @param {Joi.ValidationError} error
     * @return {JoiValidationError} self
     */
    static from(error){
        const name = error.details[0].type;
        const message = error.details[0].message;
        return new JoiValidationError(name, message);
    }
}
module.exports.JoiValidationError = JoiValidationError;