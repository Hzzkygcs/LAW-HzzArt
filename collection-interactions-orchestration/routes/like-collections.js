const express = require("express");
const {getUsernameFromJWT} = require("../modules/util/account/get-username-from-JWT");
const {validateCollection} = require("../modules/util/collections/validate-collection");
const {sendLikeService} = require("../modules/util/like-rating-collections/send-like-service");

const route = express.Router();

route.post("/", async (req, res) => {
    const jwt = req.get(process.env.JWT_JWT_TOKEN_HEADER_NAME);
    let response = await getUsernameFromJWT(jwt);

    const username = response.username;

    await validateCollection(req.body.collectionId,jwt);

    response = await sendLikeService(username, req.body.collectionId,jwt);
    res.send(response);
});

module.exports.route = route;