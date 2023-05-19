const express = require("express");
const {ReportedCollection, getReportedCollectionJoiValidation} = require("../model/reported-collection");
const {StatusCollection} = require("../model/status-collection");
const { CollectionAlreadyReportedException } = require("../modules/exceptions/CollectionAlreadyReportedException");
const {Account} = require("../model/account");
const {validateToken} = require("../service/validate-token");
const {CannotReportSelfException} = require("../modules/exceptions/CannotReportSelfException");

const route = express.Router();

route.post("/", async (req, res) => {
    validateToken(req);

    const validate = getReportedCollectionJoiValidation(["collectionId", "reportedBy", "owner", "reason"]);
    validate(req.body);

    let reportedCollection;
    const reportWithTheIDBy = await ReportedCollection.find({collectionId: req.body.collectionId, reportedBy: req.body.reportedBy}).count();
    if(req.body.reportedBy === req.body.owner){
        throw new CannotReportSelfException();
    }

    if (reportWithTheIDBy > 0){
        throw new CollectionAlreadyReportedException(req.body.collectionId);
    }
    else {
        reportedCollection = new ReportedCollection({
            collectionId: req.body.collectionId,
            reportedBy: req.body.reportedBy,
            owner: req.body.owner,
            reason: req.body.reason,
        });
        await reportedCollection.setDateTime();
        await reportedCollection.save();
    }

    let checkOwner = await Account.findOne({username: req.body.owner});
    if (checkOwner === null){
        checkOwner = new Account({
            username: req.body.owner,
        });
        await checkOwner.save();
    }
    let checkReportedBy = await Account.findOne({username: req.body.reportedBy});
    if (checkReportedBy === null){
        checkReportedBy = new Account({
            username: req.body.reportedBy,
        });
        await checkReportedBy.save();
    }

    let statusCollection = await StatusCollection.findOne({collectionId: req.body.collectionId});
    if (statusCollection === null){
        statusCollection = new StatusCollection({
            collectionId: req.body.collectionId,
        });
        await statusCollection.save();
    }

    res.send(reportedCollection.getObjectRepresentation());
});

route.get("/", async (req, res) => {
    validateToken(req);

    const reportedCollections = await ReportedCollection.aggregate([
        {
            $group: {
                _id: "$collectionId",
                reportedCount: {$sum: 1}
            }
        }
    ]);

    const reportedCollectionsWithCount = reportedCollections.map((reportedCollection) => {
        return {
            collectionId: reportedCollection._id,
            reportedCount: reportedCollection.reportedCount
        }
    });

    const reportedCollectionsWithCounts = reportedCollectionsWithCount.map((reportedCollection) => {
        return {
            collectionId: reportedCollection.collectionId,
            reportedCount: reportedCollection.reportedCount,
        }
    });

    res.send(reportedCollectionsWithCounts);
});

route.get("/:collectionId", async (req, res) => {
    validateToken(req);

    const reportedCollections = await ReportedCollection.find({collectionId: req.params.collectionId});
    res.send(reportedCollections.map((reportedCollection) => {
        return reportedCollection.getObjectRepresentation();
    }));
});

module.exports.route = route;