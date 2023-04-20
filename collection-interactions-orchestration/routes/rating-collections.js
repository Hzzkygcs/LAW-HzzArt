const express = require("express");
const {getUsernameFromJWT} = require("../modules/util/account/get-username-from-JWT");
const {validateCollection} = require("../modules/util/collections/validate-collection");
const {sendRatingService} = require("../modules/util/like-rating-collections/send-rating-service");

const route = express.Router();

route.post("/", async (req, res) => {
    const jwt = req.get(process.env.JWT_JWT_TOKEN_HEADER_NAME);
    const username = getUsernameFromJWT(jwt);

    await validateCollection(req.body.collectionId);

    await sendRatingService(username, req.body.collectionId, req.body.rating);
    res.send("SUCCESS");
});

module.exports.route = route;