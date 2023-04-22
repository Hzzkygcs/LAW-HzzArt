const express = require("express");
const {isUserBanned} = require("../service/is-user-banned");
const {validateJwtToken} = require("../service/jwt-validate/validate-token");
const {UserIsBanned} = require("../modules/exceptions/UserIsBanned");
const route = express.Router()

route.post("/", async (req, res) => {
    console.log("POST validate login")
    let token = req.body['x-jwt-token'];

    let decoded_token = validateJwtToken(token);

    let username = decoded_token.username;
    if (await isUserBanned()) {
        throw new UserIsBanned(username);
    }
    console.log("Decoded token:\n" + JSON.stringify(decoded_token));
    res.send(decoded_token);
});

module.exports.route = route;