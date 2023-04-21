const express = require("express");
const {StatusCollection, getStatusCollectionJoiValidation} = require("../model/status-collection");
const {NotFoundException} = require("../modules/exceptions/NotFoundException");
const route = express.Router();

route.get("/:collectionId", async (req, res) => {
    const validate = getStatusCollectionJoiValidation(["collectionId"]);
    validate({
        collectionId: req.params.collectionId
    });
    const statusCollection = await StatusCollection.findOne({collectionId: req.params.collectionId});
    if (!statusCollection) {
        throw new NotFoundException();
    }
    else {
        res.send(statusCollection.getObjectRepresentation());
    }
});

module.exports.route = route;