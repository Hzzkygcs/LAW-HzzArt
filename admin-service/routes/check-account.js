const express = require("express");
const {Account, getUserJoiValidation} = require("../model/admin");

const route = express.Router();

route.get("/:username", async (req, res) => {
    const validate = getUserJoiValidation(["username"]);
    validate({
        username: req.params.username
    });
    const userWithTheUsername = await Account.findOne({username: req.params.username});
    if (!userWithTheUsername) {
        console.log("User not found, creating new user");
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