const express = require("express");
const jwt = require("jsonwebtoken");
const {getAdminServiceUrl} = require("../URLs/get-admin-service-url");
const axios = require("axios");
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

    let username = decoded_token.username;
    let checkUserResponse;
    try {
        checkUserResponse = await axios({
            url: getAdminServiceUrl('/admin/check-account/' + username),
            method: 'get'
        });
    } catch (error) {
        let message = "Failed to validate user: "
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
            res.status(error.response.status).send(error.response.data);
        } else if (error.request) {
            console.log(error.request);
            res.status(408).send(message + "No response from admin service.");
        } else {
            console.log('Error:', error.message);
            res.status(400).send(message + 'Error: ' + error.message);
        }
        return -1;
    }
    console.log(checkUserResponse.data);
    if (checkUserResponse.data['isBan']) {
        res.status(403).send("User is banned.")
        return -1;
    }

    res.send(decoded_token);
});

module.exports.route = route;