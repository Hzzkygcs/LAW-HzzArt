const express = require("express");
const {User, getUserJoiValidation} = require("../model/user");

const route = express.Router();

route.post("/", async (req, res) => {
    const validate = getUserJoiValidation(["username"]);
    validate(req.body);
    const userWithTheUsername = await User.find({username: req.body.username}).count();

    res.send({
       'answer': userWithTheUsername > 0
    });
})


module.exports.route = route;