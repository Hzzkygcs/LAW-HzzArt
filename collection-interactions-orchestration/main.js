require("express-async-errors");
const express = require("express");
const {exceptionHandlerMiddleware} = require("./modules/global-route-exceptions-handler/middlewares/exceptionHandlerMiddleware");
const {jsonInvalidSyntaxHandlerMiddleware} = require("./modules/jsonInvalidSyntaxHandlerMiddleware");
const {REPORT_COLLECTIONS_ENDPOINT,
    COMMENT_COLLECTIONS_ENDPOINT,
    LIKE_COLLECTIONS_ENDPOINT,
    SEARCH_COLLECTIONS_ENDPOINT,
    POPULAR_COLLECTIONS_ENDPOINT,
    MY_COLLECTIONS_ENDPOINT} = require("./routes/endpoints");
const {route: reportCollectionsRoute} = require("./routes/report-collections");
const {route: commentCollectionsRoute} = require("./routes/comment-collections");
const {route: likeCollectionsRoute} = require("./routes/like-collections");
const {route: searchCollectionsRoute} = require("./routes/search-collections");
const {route: popularCollectionsRoute} = require("./routes/popular-collections");
const {route: myCollectionsRoute} = require("./routes/my-collections");
const {consulHealthRoute} = require("./routes/consul");
const {getConsulSingleton} = require("./config/consul");


module.exports.server = async function (test=true) {
    let app = express();

    app.use(express.json());
    app.use(jsonInvalidSyntaxHandlerMiddleware);

    app.use(REPORT_COLLECTIONS_ENDPOINT, reportCollectionsRoute);
    app.use(COMMENT_COLLECTIONS_ENDPOINT, commentCollectionsRoute);
    app.use(LIKE_COLLECTIONS_ENDPOINT, likeCollectionsRoute);
    app.use(SEARCH_COLLECTIONS_ENDPOINT, searchCollectionsRoute);
    app.use(POPULAR_COLLECTIONS_ENDPOINT, popularCollectionsRoute);
    app.use(MY_COLLECTIONS_ENDPOINT, myCollectionsRoute);
    app.use("/", consulHealthRoute);

    app.use(exceptionHandlerMiddleware);

    if (!test){
        const PORT = process.env.COLLECTION_INTERACTIONS_ORCHESTRATION_PORT;
        console.log(PORT);
        if (PORT == null){
            throw new Error("env PORT IS NOT SET");
        }
        return app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
            getConsulSingleton(PORT, process.env.COLLECTION_INTERACTIONS_ORCHESTRATION_NAME);
        });
    }
    return app.listen(() => console.log(`Listening on any port`));
};

