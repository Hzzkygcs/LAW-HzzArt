const express = require("express");
const {getUserJoiValidation, User} = require("../model/user");
const {UsernameNotFoundException} = require("../modules/exceptions/UsernameNotFoundException");

const route = express.Router();

route.post("/", async (req, res) => {
    const validate = getUserJoiValidation(["username", "password"]);
    validate(req.body);

    const users = await User.find({username: req.body.username});
    if (users.length === 0)
        throw new UsernameNotFoundException(`Username ${req.body.username} is not found`);

    let user = users[0];
    await user.validatePasswordAsync(req.body.password);

    user = user.toObject();
    delete user['password'];
    delete user['_id'];
    delete user['__v'];
    res.send(user);
})


module.exports.route = route;