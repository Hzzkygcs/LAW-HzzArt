const Joi = require("joi");
const {JoiValidationError} = require("./exceptions/JoiValidationError");

/**
 * @param {Joi.ObjectSchema} schema
 * @param {String | null} contextName
 * @return {(function(*): null)|*}
 */
function generateValidationFunction(schema){
    /**
     * @param {any} object
     *
     * @throws {JoiValidationError}
     */
    function validationFunction(object){
        if (object == null)
            object = "";
        const {value, error} = schema.validate(object);
        if (error)
            throw JoiValidationError.from(error);
        return value;
    }

    return validationFunction;
}

module.exports.generateValidationFunction = generateValidationFunction;