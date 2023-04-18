const express = require("express");
const {Account, getReportedCollectionJoiValidation, ReportedCollection} = require("../model/reported-collection");
const { CollectionAlreadyReportedException } = require("../modules/exceptions/CollectionAlreadyReportedException");

const route = express.Router();

route.post("/", async (req, res) => {
    const validate = getReportedCollectionJoiValidation(["collectionId", "reportedBy", "reason"]);
    validate(req.body);

    const reportWithTheIdandBy = await ReportedCollection.find({collectionId: req.body.collectionId, reportedBy: req.body.reportedBy}).count();
    if (reportWithTheIdandBy > 0){
        throw new CollectionAlreadyReportedException()
    }

    let reportedCollection = new ReportedCollection({
        collectionId: req.body.collectionId,
        reportedBy: req.body.reportedBy,
        reason: req.body.reason,
    });

    await reportedCollection.setDateTime();

    reportedCollection = await reportedCollection.save();   
    res.send(reportedCollection.getObjectRepresentation());
});

module.exports.route = route;