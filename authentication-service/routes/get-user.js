const express = require("express");
const {User, getUserJoiValidation, getOneUserOrThrow} = require("../model/user");
const {UsernameNotFoundException} = require("../modules/exceptions/UsernameNotFoundException");

const route = express.Router();

route.get("/:username", async (req, res) => {
    const validate = getUserJoiValidation(["username"]);
    validate({
        username: req.params.username
    });

    const user = await getOneUserOrThrow(req.params.username);
    res.send(user.getObjectRepresentation());
});

route.patch("/:username", async (req, res) => {
    const validate = getUserJoiValidation(["old_password", "new_password"]);
    validate({
        old_password: req.body.old_password,
        new_password: req.body.new_password
    });
    let userWithTheUsername = await getOneUserOrThrow(req.params.username);
    await userWithTheUsername.validatePasswordAsync(req.body.old_password);
    await userWithTheUsername.setPassword(req.body.new_password);
    userWithTheUsername = await userWithTheUsername.save();

    res.send(userWithTheUsername.getObjectRepresentation());
});


module.exports.route = route;