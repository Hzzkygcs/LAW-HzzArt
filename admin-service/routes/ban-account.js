const express = require("express");
const {Account, getAccountJoiValidation} = require("../model/account");
const {ReportedCollection} = require("../model/reported-collection");
const {validateToken} = require("../service/validate-token");
const {InvalidBooleanFieldsException} = require("../modules/exceptions/InvalidBooleanFields");

const route = express.Router();

route.post("/", async (req, res) => {
    validateToken(req);

    const validate = getAccountJoiValidation(["username", "isBan"]);
    validate(req.body);
    
    const userWithTheUsername = await Account.findOne({username: req.body.username})

    if (req.body.isBan === true) {
        userWithTheUsername.isBan = true;
    }
    else if (req.body.isBan === false) {
        userWithTheUsername.isBan = false;
    }
    else {
        throw new InvalidBooleanFieldsException();
    }

    await ReportedCollection.deleteOne({owner: req.body.username});
    await userWithTheUsername.save();
    res.send(userWithTheUsername.getObjectRepresentation());
});

module.exports.route = route;