const express = require("express");
const {getUsernameFromJWT} = require("../modules/util/account/get-username-from-JWT");
const {validateCollection} = require("../modules/util/collections/validate-collection");
const {sendAdminManagementService} = require("../modules/util/admin-service/send-admin-management-service");

const route = express.Router();

route.post("/", async (req, res) => {
    const jwt = req.get(process.env.JWT_JWT_TOKEN_HEADER_NAME);
    const username = getUsernameFromJWT(jwt);
    validateCollection(req.body.collectionId);
    sendAdminManagementService(username, req.body.collectionId, req.body.reason);
});

module.exports.route = route;