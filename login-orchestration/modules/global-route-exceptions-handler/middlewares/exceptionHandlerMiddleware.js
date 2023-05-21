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

    handleAutomaticallyHandledException(error, req, res, next);
    handleServiceResponseException(error, req, res, next);

}
module.exports.exceptionHandlerMiddleware = exceptionHandlerMiddleware;


function handleAutomaticallyHandledException(error, _req, res, next) {
    if (!(error instanceof AutomaticallyHandledException)){
        return false;
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
    return true;
}


function handleServiceResponseException(error, _req, res, next) {
    if (!(error instanceof ServiceResponseException)){
        return false;
    }

    const body = Object.assign({}, error.reason);
    body.reason = body.reason ?? {};
    body.reason.serviceName = error.serviceName;

    res.status(error.statusCode)
        .send(body);

    next();
    return true;
}