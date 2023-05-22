const path = require("path");
const logger = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const {define_routes} = require("../config/routes");
const {exceptionHandlerMiddleware} = require("../modules/global-route-exceptions-handler/middlewares/exceptionHandlerMiddleware");
const {getConsulSingleton} = require("./consul");


module.exports.config = function (app) {
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    define_routes(app);

    app.use(exceptionHandlerMiddleware);
    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        next(err);
    });

    const PORT = process.env.VIDEO_PROCESSING_SERVICE_PORT;
    if (PORT == null){
        throw new Error("env PORT IS NOT SET");
    }
    return app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
        getConsulSingleton(PORT, process.env.VIDEO_PROCESSING_SERVICE_NAME);
    });
}