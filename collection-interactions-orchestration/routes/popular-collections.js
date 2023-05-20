const express = require("express");
const {getUsernameFromJWT} = require("../modules/util/account/get-username-from-JWT");
const {getAllCollections} = require("../modules/util/collections/get-all-collections");
const route = express.Router();

route.get("/", async (req, res) => {
    const jwt = req.get(process.env.JWT_TOKEN_HEADER_NAME);

    await getUsernameFromJWT(jwt);

    let allCollections = await getAllCollections();

    res.send(allCollections);
});

module.exports.route = route;