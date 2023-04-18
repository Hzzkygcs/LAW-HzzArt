const express = require("express");
const {Account, getUserJoiValidation} = require("../model/admin");

const route = express.Router();

route.post("/", async (req, res) => {
    const validate = getUserJoiValidation(["username", "isAdmin"]);
    validate(req.body);

    const userWithTheUsername = await Account.findOne({username: req.body.username})

    if (req.body.isAdmin === true) {
        userWithTheUsername.isAdmin = true;
    }
    else if (req.body.isAdmin === false) {
        userWithTheUsername.isAdmin = false;
    }
    else {
        throw new Error("isAdmin must be either true or false");
    }

    await userWithTheUsername.save();
    res.send(userWithTheUsername.getObjectRepresentation());
});

module.exports.route = route;