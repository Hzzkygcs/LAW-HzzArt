const express = require("express");
const {getUsernameFromJWT} = require("../modules/util/account/get-username-from-JWT");
const {validateCollection} = require("../modules/util/collections/validate-collection");
const {sendAdminManagementService} = require("../modules/util/admin-service/send-admin-management-service");

const route = express.Router();

route.post("/", async (req, res) => {
    const jwt = req.get(process.env.JWT_TOKEN_HEADER_NAME);
    let response = await getUsernameFromJWT(jwt);
    const reportedBy = response.username;
    // get owner of collection from pram
    // const ownerCollection = validateCollection(req.body.collectionId);
    const ownerCollection = "test";

    response = await sendAdminManagementService(req.body.collectionId, reportedBy, ownerCollection, req.body.reason);
    res.send(response);
});

module.exports.route = route;
