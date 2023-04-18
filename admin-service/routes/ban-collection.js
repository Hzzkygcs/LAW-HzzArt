const express = require("express");
const {StatusCollection, getStatusCollectionJoiValidation} = require("../model/status-collection");
const {ReportedCollection} = require("../model/reported-collection");
const {InvalidBooleanFieldsException} = require("../modules/exceptions/InvalidBooleanFields");
const {validateToken} = require("../service/validate-token");

const route = express.Router();

route.post("/", async (req, res) => {
    validateToken(req);

    const validate = getStatusCollectionJoiValidation(["collectionId", "isBan"]);
    validate(req.body);

    const idWithTheCollectionId = await StatusCollection.findOne({collectionId: req.body.collectionId})

    if (req.body.isBan === true) {
        idWithTheCollectionId.isBan = true;

    }
    else if (req.body.isBan === false) {
        idWithTheCollectionId.isBan = false;
    }
    else {
        throw new InvalidBooleanFieldsException();
    }
    await ReportedCollection.deleteOne({collectionId: req.body.collectionId});
    await idWithTheCollectionId.save();
    res.send(idWithTheCollectionId.getObjectRepresentation());
});

module.exports.route = route;
