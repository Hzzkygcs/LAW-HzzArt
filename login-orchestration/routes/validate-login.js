const express = require("express");
const jwt = require("jsonwebtoken");

const route = express.Router()

route.post("/", async (req, res) => {
    let token = req.body['x-jwt-token'];
    if (!token) {
        res.status(400).send("Bad syntax.")
    }
    let secretKey = process.env.JWT_SECRET_KEY;
    let decoded_token;
    try {
        decoded_token = jwt.verify(token, secretKey);
    } catch (error) {
        console.log(error.message)
        res.status(401).send('Failed to validate token: ' + error.message)
    }
    res.send(decoded_token);
});

module.exports.route = route;