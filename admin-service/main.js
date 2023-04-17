require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const {exceptionHandlerMiddleware} = require("./modules/global-route-exceptions-handler/middlewares/exceptionHandlerMiddleware");
const {jsonInvalidSyntaxHandlerMiddleware} = require("./modules/jsonInvalidSyntaxHandlerMiddleware");
const {CHECK_ACCOUNT_ENDPOINT} = require("./routes/endpoints");
const {route: checkAccountRoute} = require("./routes/check-account");
// const {route: checkCollectionsRoute} = require("./routes/check-collections");
// const {route: reportedCollectionsRoute} = require("./routes/reported-collections");
// const {route: acceptReportedCollectionRoute} = require("./routes/accept-reported-collection");
// const {route: rejectReportedCollectionRoute} = require("./routes/reject-reported-collection");

module.exports.server = async function (test=true) {
    app = express();

    await  connectToMongodb(test);
    app.use(express.json());
    app.use(jsonInvalidSyntaxHandlerMiddleware);

    app.use(CHECK_ACCOUNT_ENDPOINT, checkAccountRoute);
    // app.use(CHECK_COLECTIONS_ENDPOINT, checkCollectionsRoute);
    // app.use(REPORTED_COLLECTIONS_ENDPOINT, reportedCollectionsRoute);
    // app.use(ACCEPT_REPORTED_COLLECTION_ENDPOINT, acceptReportedCollectionRoute);
    // app.use(REJECT_REPORTED_COLLECTION_ENDPOINT, rejectReportedCollectionRoute);

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
    return mongooseUrl.replace(/\/\/.*@/, "//");
}