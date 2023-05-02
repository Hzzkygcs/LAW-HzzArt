const express = require("express");
const {Account, getAccountJoiValidation} = require("../model/account");
const {InvalidBooleanFieldsException} = require("../modules/exceptions/InvalidBooleanFields");
const {validateToken} = require("../service/validate-token");
const {UsernameNotFoundException} = require("../modules/exceptions/UsernameNotFoundException");

const route = express.Router();

route.post("/", async (req, res) => {
    validateToken(req);

    const validate = getAccountJoiValidation(["username", "isAdmin"]);
    validate(req.body);

    const userWithTheUsername = await Account.findOne({username: req.body.username})
    if (userWithTheUsername === null){
        throw new UsernameNotFoundException(req.body.username);
    }

    if (req.body.isAdmin === true) {
        userWithTheUsername.isAdmin = true;
    }
    else if (req.body.isAdmin === false) {
        userWithTheUsername.isAdmin = false;
    }
    else {
        throw new InvalidBooleanFieldsException();
    }

    await userWithTheUsername.save();
    res.send(userWithTheUsername.getObjectRepresentation());
});

module.exports.route = route;