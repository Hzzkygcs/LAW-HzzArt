require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const {exceptionHandlerMiddleware} = require("./modules/global-route-exceptions-handler/middlewares/exceptionHandlerMiddleware");
const {jsonInvalidSyntaxHandlerMiddleware} = require("./modules/jsonInvalidSyntaxHandlerMiddleware");
const {CHECK_ACCOUNT_ENDPOINT,
    CHECK_COLLECTIONS_ENDPOINT,
    PERMISSION_CONTROL_ENDPOINT,
    REPORT_COLLECTIONS_ENDPOINT,
    BAN_COLLECTION_ENDPOINT,
    BAN_ACCOUNT_ENDPOINT} = require("./routes/endpoints");
const {route: checkAccountRoute} = require("./routes/check-account");
const {route: permissionControlRoute} = require("./routes/permission-control");
const {route: checkCollectionsRoute} = require("./routes/check-collections");
const {route: reportCollectionsRoute} = require("./routes/report-collection");
const {route: banCollectionRoute} = require("./routes/ban-collection");
const {route: banAccountRoute} = require("./routes/ban-account");

module.exports.server = async function (test=true) {
    let app = express();

    await connectToMongodb(test);
    app.use(express.json());
    app.use(jsonInvalidSyntaxHandlerMiddleware);

    app.use(CHECK_ACCOUNT_ENDPOINT, checkAccountRoute);
    app.use(PERMISSION_CONTROL_ENDPOINT, permissionControlRoute);
    app.use(CHECK_COLLECTIONS_ENDPOINT, checkCollectionsRoute);
    app.use(REPORT_COLLECTIONS_ENDPOINT, reportCollectionsRoute);
    app.use(BAN_COLLECTION_ENDPOINT, banCollectionRoute);
    app.use(BAN_ACCOUNT_ENDPOINT, banAccountRoute);

    app.use(exceptionHandlerMiddleware);

    if (!test){
        const PORT = process.env.ADMIN_SERVICE_PORT;
        console.log(PORT);
        if (PORT == null){
            throw new Error("env PORT IS NOT SET");
        }
        return app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    }
    return app.listen(() => console.log(`Listening on any port`));
};

async function connectToMongodb(test){
    let mongooseUrl = process.env.DATABASE_HOST_URL;
    if (mongooseUrl == null){
        console.log("DATABASE_HOST_URL IS NOT SET");
        mongooseUrl = "mongodb://main-user:391A0777775C663B07E6B5B7E0886D56@localhost:27017/admin-service";
    }

    try{
        console.log(`Connecting to mongodb ${removeCredentialFromMongodbUrl(mongooseUrl)}`)
        await mongoose.connect(mongooseUrl);
        mongooseUrl = removeCredentialFromMongodbUrl(mongooseUrl);
        console.log(`Connected to mongodb ${mongooseUrl}`)
        module.exports.connection = mongooseUrl;
    }catch (e){
        console.log("FAILED TO CONNECT TO MONGODB");
        console.log(e.message);
        throw e;
    }
}

function removeCredentialFromMongodbUrl(mongooseUrl) {
    return mongooseUrl.replace(/\/\/.*@/, "//");
}