require("express-async-errors");
const express = require("express");
const {route: loginRoute} = require("./routes/validate-login");
const {route: registerRoute} = require("./routes/register");
const {exceptionHandlerMiddleware} = require("./modules/global-route-exceptions-handler/middlewares/exceptionHandlerMiddleware");
const mongoose = require("mongoose");
const {jsonInvalidSyntaxHandlerMiddleware} = require("./modules/jsonInvalidSyntaxHandlerMiddleware");
const {USERNAME_VALID_ENDPOINT, REGISTER_ENDPOINT, VALIDATE_LOGIN_ENDPOINT} = require("./routes/endpoints");
const {route: usernameValidRoute} = require("./routes/get-user");
const {getEurekaClient, getEurekaSingleton} = require("./config/eureka");




module.exports.server = async function (test=true) {
    let app = express();

    await  connectToMongodb(test);
    app.use(express.json());
    app.use(jsonInvalidSyntaxHandlerMiddleware);

    app.use(USERNAME_VALID_ENDPOINT, usernameValidRoute);
    app.use(REGISTER_ENDPOINT, registerRoute);
    app.use(VALIDATE_LOGIN_ENDPOINT, loginRoute);

    app.use(exceptionHandlerMiddleware);


    if (!test){
        const PORT = process.env.AUTHENTICATION_SERVICE_PORT;
        if (PORT == null){
            throw new Error("env PORT IS NOT SET");
        }

        await getEurekaSingleton(PORT, process.env.AUTHENTICATION_SERVICE_NAME);
        return app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    }
    return app.listen(() => console.log(`Listening on any port`));
};

let testMongo = null;

async function connectToMongodb(test){
    let mongooseUrl = process.env.DATABASE_HOST_URL;
    if (test && testMongo==null){
        const {MongoMemoryServer} = require("mongodb-memory-server");
        testMongo = await MongoMemoryServer.create();
    }
    if (test){
        mongooseUrl = testMongo.getUri();
    }
    if (mongooseUrl == null){throw new Error("DATABASE_HOST_URL IS NOT SET");}

    try{
        await mongoose.connect(mongooseUrl);
        mongooseUrl = removeCredentialFromMongodbUrl(mongooseUrl);
        console.log(`Connected to mongodb ${mongooseUrl}`)
        module.exports.connection = mongooseUrl;
    }catch (e){
        console.log("FAILED TO CONNECT TO MONGODB");
        throw e;
    }
}

function removeCredentialFromMongodbUrl(mongooseUrl) {
    return mongooseUrl.replace(/\/[a-zA-Z0-9-]+:[a-zA-Z0-9-]+@/, "/USERNAME:PASSWORD@")
}