const express = require("express");
const {getUserJoiValidation, User, getOneUserOrThrow} = require("../model/user");
const {UsernameNotFoundException} = require("../modules/exceptions/UsernameNotFoundException");

const route = express.Router();

route.post("/", async (req, res) => {
    const validate = getUserJoiValidation(["username", "password"]);
    validate(req.body);

    let user = await getOneUserOrThrow(req.body.username);
    await user.validatePasswordAsync(req.body.password);
    user = user.getObjectRepresentation();
    res.send(user);
})


module.exports.route = route;