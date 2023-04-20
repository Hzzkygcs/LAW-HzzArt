const express = require("express");
const axios = require("axios");
const {getAuthenticationServiceUrl} = require("../URLs/get-authentication-service-url");

const route = express.Router()

route.post("/", async (request, result) => {
    const username = request.body.username
    const response = await axios({
        url: getAuthenticationServiceUrl('/auth/username/' + username),
        method: 'get',
    }).catch(function (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        console.log(error.config);
    })
    console.log(response);
    console.log(response.body);
});

module.exports.route = route;