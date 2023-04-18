const express = require("express");
const {StatusCollection, getStatusCollectionJoiValidation} = require("../model/status-collection");
const route = express.Router();

route.get("/:collectionId", async (req, res) => {
    const validate = getStatusCollectionJoiValidation(["collectionId"]);
    validate({
        collectionId: req.params.collectionId
    });
    const statusCollection = await StatusCollection.findOne({collectionId: req.params.collectionId});
    if (!statusCollection) {
        console.log("Report not found");
        res.status(404).send("Report not found");
    }
    else {
        res.send(statusCollection.getObjectRepresentation());
    }
});

module.exports.route = route;