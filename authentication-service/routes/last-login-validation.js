const express = require("express");

const route = express.Router();

route.post("/", (req, res) => {
    res.send("Hello world!");

})


module.exports.route = route;