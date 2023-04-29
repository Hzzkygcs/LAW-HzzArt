const {AutomaticallyHandledException} = require("../exceptions/AutomaticallyHandledException");
const {ServiceResponseException} = require("../../exceptions/ServiceResponseException");
const {BaseAutomaticallyHandledException} = require("../exceptions/BaseAutomaticallyHandledException");
const {express} = require('express');


/**
 * @param {AutomaticallyHandledException, ServiceResponseException} error
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
function exceptionHandlerMiddleware(error, req, res, next) {
    if (!(error instanceof BaseAutomaticallyHandledException)){
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