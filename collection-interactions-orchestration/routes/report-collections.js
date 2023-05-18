const express = require("express");
const {getUsernameFromJWT} = require("../modules/util/account/get-username-from-JWT");
const {validateCollection} = require("../modules/util/collections/validate-collection");
const {sendAdminManagementService} = require("../modules/util/admin-service/send-admin-management-service");

const route = express.Router();

route.post("/", async (req, res) => {
    const jwt = req.get(process.env.JWT_TOKEN_HEADER_NAME);
    let response = await getUsernameFromJWT(jwt);
    if (response.status !== 200) {
        res.send(response);
        return;
    }
    const reportedBy = response.data.username;

    const responseCollection = await validateCollection(req.body.collectionId,jwt);
    console.log("Response collection: " + JSON.stringify(responseCollection.data));

    if (responseCollection.status !== 200) {
        res.send(responseCollection);
        return;
    }

    let ownerCollection = responseCollection.data.owner;
    console.log("Owner collection: " + ownerCollection);
    let responseAdminManagement = await sendAdminManagementService(
        req.body.collectionId,
        reportedBy,
        ownerCollection,
        req.body.reason
    );
    console.log("Response admin management: " + JSON.stringify(responseAdminManagement));
    res.send(responseAdminManagement);
});

module.exports.route = route;
