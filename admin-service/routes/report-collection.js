const express = require("express");
const {ReportedCollection, getReportedCollectionJoiValidation} = require("../model/reported-collection");
const {StatusCollection} = require("../model/status-collection");
const { CollectionAlreadyReportedException } = require("../modules/exceptions/CollectionAlreadyReportedException");
const {Account} = require("../model/account");

const route = express.Router();

route.post("/", async (req, res) => {
    const validate = getReportedCollectionJoiValidation(["collectionId", "reportedBy", "owner", "reason"]);
    validate(req.body);

    const reportWithTheIdandBy = await ReportedCollection.find({collectionId: req.body.collectionId, reportedBy: req.body.reportedBy}).count();
    if (reportWithTheIdandBy > 0){
        throw new CollectionAlreadyReportedException()
    }

    const checkAccount = await Account.findOne({username: req.body.owner});
    console.log(checkAccount);
    if (checkAccount === null){
        let user = new Account({
            username: req.body.owner,
        });
        user = await user.save();
    }

    let reportedCollection = new ReportedCollection({
        collectionId: req.body.collectionId,
        reportedBy: req.body.reportedBy,
        owner: req.body.owner,
        reason: req.body.reason,
    });

    await reportedCollection.setDateTime();
    reportedCollection = await reportedCollection.save();   

    let statusCollection = new StatusCollection({
        collectionId: req.body.collectionId,
    });

    statusCollection = await statusCollection.save();
    res.send(reportedCollection.getObjectRepresentation());
});

module.exports.route = route;