const {AutomaticallyHandledException} = require("../exceptions/AutomaticallyHandledException");
const {ERROR_CODE_RESPONSE_PROPERTY_NAME, MESSAGE_RESPONSE_PROPERTY_NAME, REASON_RESPONSE_PROPERTY_NAME} = require("../constants");


/**
 * @param {AutomaticallyHandledException} error
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
function exceptionHandlerMiddleware(error, _req, res, next) {
    if (!(error instanceof AutomaticallyHandledException)){
        next(error);
        return;
    }

    let reason = {};
    reason[ERROR_CODE_RESPONSE_PROPERTY_NAME] = error.name;
    reason[MESSAGE_RESPONSE_PROPERTY_NAME] = error.message;

    reason = Object.assign(reason, error.additionalBody);

    error.handled = true;
    const ret = {};
    ret[REASON_RESPONSE_PROPERTY_NAME] = reason;
    res.status(error.statusCode).send(ret);

    next();
}
module.exports.exceptionHandlerMiddleware = exceptionHandlerMiddleware;