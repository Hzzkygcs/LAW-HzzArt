require("express-async-errors");
const express = require("express");
const {route: lastLoginValidationRoute} = require("./routes/last-login");
const {route: loginRoute} = require("./routes/login");
const {route: registerRoute} = require("./routes/register");
const {exceptionHandlerMiddleware} = require("./modules/global-route-exceptions-handler/middlewares/exceptionHandlerMiddleware");
const mongoose = require("mongoose");
const {jsonInvalidSyntaxHandlerMiddleware} = require("./modules/jsonInvalidSyntaxHandlerMiddleware");
const {USERNAME_VALID_ENDPOINT, REGISTER_ENDPOINT} = require("./routes/endpoints");
const {route: usernameValidRoute} = require("./routes/username-valid");




module.exports.server = async function (test=true) {
    app = express();

    await  connectToMongodb(test);
    app.use(express.json());
    app.use(jsonInvalidSyntaxHandlerMiddleware);

    app.use('/auth/last-login-date-validation', lastLoginValidationRoute);
    app.use(USERNAME_VALID_ENDPOINT, usernameValidRoute);
    app.use(REGISTER_ENDPOINT, registerRoute);
    app.use('/auth/login', loginRoute);

    app.use(exceptionHandlerMiddleware);



    if (!test){
        const PORT = process.env.AUTHENTICATION_SERVICE_PORT;
        if (PORT == null){
            throw new Error("env PORT IS NOT SET");
        }
        return app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    }
    return app.listen(() => console.log(`Listening on any port`));
};


async function connectToMongodb(test){
    let mongooseUrl = process.env.DATABASE_HOST_URL;
    if (test){
        mongooseUrl = "mongodb://localhost:27017/auth-service";
        mongooseUrl = `${mongooseUrl}-test-${process.env.JEST_WORKER_ID}`;
    }
    if (mongooseUrl == null){throw new Error("DATABASE_HOST_URL IS NOT SET");}

    try{
        await mongoose.connect(mongooseUrl);
        console.log(`Connected to mongodb ${mongooseUrl}`)
        module.exports.connection = mongooseUrl;
    }catch (e){
        console.log("FAILED TO CONNECT TO MONGODB");
        throw e;
    }
}