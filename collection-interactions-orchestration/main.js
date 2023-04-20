require("express-async-errors");
const express = require("express");
const {exceptionHandlerMiddleware} = require("./modules/global-route-exceptions-handler/middlewares/exceptionHandlerMiddleware");
const {jsonInvalidSyntaxHandlerMiddleware} = require("./modules/jsonInvalidSyntaxHandlerMiddleware");
const {REPORT_COLLECTIONS_ENDPOINT,
    RATING_COLLECTIONS_ENDPOINT,
    LIKE_COLLECTIONS_ENDPOINT,
    SEARCH_COLLECTIONS_ENDPOINT} = require("./routes/endpoints");
const {reportCollectionsRoute} = require("./routes/report-collections");
const {ratingCollectionsRoute} = require("./routes/rating-collections");
const {likeCollectionsRoute} = require("./routes/like-collections");
const {searchCollectionsRoute} = require("./routes/search-collections");


module.exports.server = async function (test=true) {
    let app = express();

    app.use(express.json());
    app.use(jsonInvalidSyntaxHandlerMiddleware);

    app.use(REPORT_COLLECTIONS_ENDPOINT, reportCollectionsRoute);
    app.use(RATING_COLLECTIONS_ENDPOINT, ratingCollectionsRoute);
    app.use(LIKE_COLLECTIONS_ENDPOINT, likeCollectionsRoute);
    app.use(SEARCH_COLLECTIONS_ENDPOINT, searchCollectionsRoute);

    app.use(exceptionHandlerMiddleware);

    if (!test){
        const PORT = process.env.COLLECTION_ORCHESTRATION_PORT;
        console.log(PORT);
        if (PORT == null){
            throw new Error("env PORT IS NOT SET");
        }
        return app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    }
    return app.listen(() => console.log(`Listening on any port`));
};

