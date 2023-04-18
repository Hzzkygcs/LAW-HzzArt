const express = require("express");
const {Account, getReportedCollectionJoiValidation} = require("../model/reported-collection");

const route = express.Router();

route.get("/:collectionId", async (req, res) => {
    const validate = getReportedCollectionJoiValidation(["collectionId"]);
    validate({
        collectionId: req.params.collectionId
    });
    const reportedCollectionWithTheId = await ReportedCollection.findOne({collectionId: req.params.collectionId});

    res.send(reportedCollectionWithTheId.getObjectRepresentation());
});

module.exports.route = route;