const express = require("express");
const {getUsernameFromJWT} = require("../modules/util/account/get-username-from-JWT");
const {validateCollection} = require("../modules/util/collections/validate-collection");
const {sendLikeService} = require("../modules/util/like-rating-collections/send-like-service");

const route = express.Router();

route.post("/", async (req, res) => {
    const jwt = req.get(process.env.JWT_JWT_TOKEN_HEADER_NAME);
    const username = getUsernameFromJWT(jwt);
    validateCollection(req.body.collectionId);
    sendLikeService(username, req.body.collectionId, req.body.like);
    res.send("SUCCESS");
});

module.exports.route = route;