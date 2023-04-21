const express = require("express");
const jwt = require("jsonwebtoken");
const {isUserBanned} = require("../service/isUserBanned");
const route = express.Router()

route.post("/", async (req, res) => {
    console.log("POST validate login")
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

    let username = decoded_token.username;
    let checkUserResponse = await isUserBanned(username);
    if (checkUserResponse.status !== 200) {
        res.status(checkUserResponse.status).send(checkUserResponse.message);
        return -1;
    }
    if (checkUserResponse.isBan) {
        res.status(403).send("User is banned.");
        return -1;
    }
    console.log("Decoded token:\n" + JSON.stringify(decoded_token));
    res.send(decoded_token);
});

module.exports.route = route;