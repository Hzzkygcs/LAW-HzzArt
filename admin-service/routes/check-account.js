const express = require("express");
const {Account, getAccountJoiValidation} = require("../model/account");

const route = express.Router();

route.get("/", async (req, res) => {
    const statusCollections = await Account.find();
    let listUsers = [];
    statusCollections.forEach((statusUser) => {
        if (statusUser.isBan) {
            listUsers.push(statusUser.username);
        }
    });
    res.send(listUsers);
});

route.get("/:username", async (req, res) => {
    const validate = getAccountJoiValidation(["username"]);
    validate({
        username: req.params.username
    });
    const userWithTheUsername = await Account.findOne({username: req.params.username});
    if (!userWithTheUsername) {
        console.log("User not found, creating new user: " + req.params.username);
        let user = new Account({
            username: req.params.username
        });
        user = await user.save();
        res.send(user.getObjectRepresentation());
    }
    else {
        res.send(userWithTheUsername.getObjectRepresentation());
    }
});

module.exports.route = route;