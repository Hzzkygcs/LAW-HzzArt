const express = require("express");
const {StatusCollection, getStatusCollectionJoiValidation} = require("../model/status-collection");
const {CollectionNotFoundException} = require("../modules/exceptions/CollectionNotFoundException");
const route = express.Router();

route.get("/", async (req, res) => {
    const statusCollections = await StatusCollection.find();
    let listBanCollections = [];
    statusCollections.forEach((statusCollection) => {
        if (statusCollection.isBan) {
            listBanCollections.push(parseInt(statusCollection.collectionId));
        }
    });
    res.send(listBanCollections);
});

route.get("/:collectionId", async (req, res) => {
    const validate = getStatusCollectionJoiValidation(["collectionId"]);
    const collectionId = req.params.collectionId;
    validate({
        collectionId: collectionId
    });
    const statusCollection = await StatusCollection.findOne({collectionId: collectionId});
    if (!statusCollection) {
        throw new CollectionNotFoundException(`Collection ${collectionId} is not found`);
    }
    else {
        res.send(statusCollection.getObjectRepresentation());
    }
});

module.exports.route = route;