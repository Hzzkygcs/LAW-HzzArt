const express = require("express");
const {getUsernameFromJWT} = require("../modules/util/account/get-username-from-JWT");
const {validateCollection} = require("../modules/util/collections/validate-collection");
const {sendAdminManagementService} = require("../modules/util/admin-service/send-admin-management-service");
const {UserIsNotAdminException} = require("../modules/exceptions/UserIsNotAdminException");
const {getReportedCollections,getDetailsReportedCollections} = require("../modules/util/admin-service/get-reported-collections");
const {sendBanAccount,reportAcceptReject} = require("../modules/util/admin-service/./send-ban");
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

route.post("/ban-collection", async (req, res) => {
    const jwt = req.get(process.env.JWT_TOKEN_HEADER_NAME);
    await getUsernameFromJWT(jwt);

    await validateCollection(req.body.collectionId,jwt);

    let response = await reportAcceptReject(req.body.collectionId,true);

    res.send(response);
});

route.post("/ban-account", async (req, res) => {
    const jwt = req.get(process.env.JWT_TOKEN_HEADER_NAME);
    await getUsernameFromJWT(jwt);

    let response = await sendBanAccount(req.body.username);

    res.send(response);
});

route.post("/reject-report", async (req, res) => {
    const jwt = req.get(process.env.JWT_TOKEN_HEADER_NAME);
    await getUsernameFromJWT(jwt);

    let response = await reportAcceptReject(req.body.collectionId,false);

    res.send(response);
});

route.get("/", async (req, res) => {
    const jwt = req.get(process.env.JWT_TOKEN_HEADER_NAME);
    console.log("jwt",jwt);
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

route.get("/:collectionId", async (req, res) => {
    const jwt = req.get(process.env.JWT_TOKEN_HEADER_NAME);
    let response = await getUsernameFromJWT(jwt);

    if (!response.admin) {
        throw new UserIsNotAdminException(response.username);
    }
    await validateCollection(req.params.collectionId,jwt);

    const specificCollection = await validateCollection(req.params.collectionId,jwt);

    const responseReportedCollections = await getDetailsReportedCollections(req.params.collectionId);

    // Aggregate reports with the collection
    const aggregatedData = {
      ...specificCollection,
      reports: responseReportedCollections.filter(report => report.collectionId === req.params.collectionId)
    };

    console.log(aggregatedData);

    res.send(aggregatedData);
});

module.exports.route = route;
