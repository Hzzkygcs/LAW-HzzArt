const express = require("express");
const {User, getUserJoiValidation} = require("../model/user");
const {UsernameAlreadyExists} = require("../modules/exceptions/UsernameAlreadyExists");

const route = express.Router();

route.post("/", async (req, res) => {
    const validate = getUserJoiValidation(["username", "password"]);
    validate(req.body);
    const userWithTheUsername = await User.find({username: req.body.username}).count().exec();
    if (userWithTheUsername > 0){
        throw new UsernameAlreadyExists(req.body.username)
    }

    let user = new User({
        username: req.body.username
    });
    await user.setPassword(req.body.password);
    await user.setLastPasswordUpdateDateToNow();

    user = await user.save();
    res.send(user.getObjectRepresentation());
})


module.exports.route = route;