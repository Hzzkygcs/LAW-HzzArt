require("express-async-errors");
const express = require("express");
const {NEW_LOGIN_ENDPOINT, VALIDATE_LOGIN_ENDPOINT} = require("./routes/endpoints");
const {route: newLoginRoute} = require("./routes/new-login");
const {route: validateLoginRoute} = require("./routes/validate-login");
const {exceptionHandlerMiddleware} = require("./modules/global-route-exceptions-handler/middlewares/exceptionHandlerMiddleware");
const {jsonInvalidSyntaxHandlerMiddleware} = require("./modules/jsonInvalidSyntaxHandlerMiddleware");


module.exports.server = async function (test= true) {
    let app = express();

    app.use(express.json());
    app.use(jsonInvalidSyntaxHandlerMiddleware);

    app.use(NEW_LOGIN_ENDPOINT, newLoginRoute);
    app.use(VALIDATE_LOGIN_ENDPOINT, validateLoginRoute);

    app.use(exceptionHandlerMiddleware);


    if (!test){
        const PORT = process.env.LOGIN_ORCHESTRATION_PORT;
        if (PORT == null){
            throw new Error("env PORT IS NOT SET");
        }
        return app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    }
    return app.listen(() => console.log(`Listening on any port`));
};