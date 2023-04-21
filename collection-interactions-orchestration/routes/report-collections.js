const express = require("express");
const {getUsernameFromJWT} = require("../modules/util/account/get-username-from-JWT");
const {validateCollection} = require("../modules/util/collections/validate-collection");
const {sendAdminManagementService} = require("../modules/util/admin-service/send-admin-management-service");

const route = express.Router();

route.post("/", async (req, res) => {
    // const jwt = req.get(process.env.JWT_TOKEN_HEADER_NAME);
    // const username = getUsernameFromJWT(jwt);
    const reportedBy = "abc";
    // await validateCollection(req.body.collectionId);

    await sendAdminManagementService(reportedBy, req.body.collectionId, req.body.reason, res);
});

module.exports.route = route;