const express = require("express");
const {getUsernameFromJWT} = require("../modules/util/account/get-username-from-JWT");
const {validateCollection} = require("../modules/util/collections/validate-collection");
const {sendAdminManagementService} = require("../modules/util/admin-service/send-admin-management-service");
const {UserIsNotAdminException} = require("../modules/exceptions/UserIsNotAdminException");
const {getReportedCollections} = require("../modules/util/admin-service/get-reported-collections");
const route = express.Router();

route.post("/", async (req, res) => {
    const jwt = req.get(process.env.JWT_TOKEN_HEADER_NAME);
    let response = await getUsernameFromJWT(jwt);
    const responseCollection = await validateCollection(req.body.collectionId,jwt);

    const reportedBy = response.username;
    let ownerCollection = responseCollection.owner;
    let responseAdminManagement = await sendAdminManagementService(
        req.body.collectionId,
        reportedBy,
        ownerCollection,
        req.body.reason
    );
    res.send(responseAdminManagement);
});

route.get("/", async (req, res) => {
    const jwt = req.get(process.env.JWT_TOKEN_HEADER_NAME);
    console.log("jwt");
    console.log(jwt);
    let response = await getUsernameFromJWT(jwt);

    if (!response.admin) {
        throw new UserIsNotAdminException(response.username);
    }
    const responseReportedCollection = await getReportedCollections();

    listCollections = [];
    for (let i = 0; i < responseReportedCollection.length; i++) {
        const responseCollection = await validateCollection(responseReportedCollection[i].collectionId,jwt);
        console.log(responseCollection);
        listCollections.push(responseCollection);
    }

    // Create a map to store aggregated data
    const aggregatedData = new Map();

    // Aggregate the data
    responseReportedCollection.forEach(item1 => {
      const collectionId = item1.collectionId;
      listCollections.forEach(item2 => {
        if (item2.id.toString() === collectionId) {
          item2.reportedCount = item1.reportedCount;
          aggregatedData.set(collectionId, item2);
        }
      });
    });

    // Convert aggregated data back to an array
    const aggregatedArray = Array.from(aggregatedData.values());

    res.send(aggregatedArray);
});

module.exports.route = route;
