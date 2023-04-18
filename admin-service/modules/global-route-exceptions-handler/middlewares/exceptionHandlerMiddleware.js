const {AutomaticallyHandledException} = require("../exceptions/AutomaticallyHandledException");


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

    let reason = {
        error_code: error.name,
        message: error.message
    };
    reason = Object.assign(reason, error.additionalBody);

    error.handled = true;
    res.status(error.statusCode)
       .send({reason: reason});

    next();
}
module.exports.exceptionHandlerMiddleware = exceptionHandlerMiddleware;