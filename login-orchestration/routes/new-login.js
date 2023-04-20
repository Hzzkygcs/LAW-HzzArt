const express = require("express");
const axios = require("axios");
const {getAuthenticationServiceUrl} = require("../URLs/get-authentication-service-url");

const route = express.Router()

route.post("/", async (request, result) => {
   const responseData = await axios({
        url: getAuthenticationServiceUrl('/auth/validate-login'),
        method: 'post',
        data: {
            username: request.body.username,
            password: request.body.password,
        }
    }).then(function (response) {
        console.log(response.data);
        return response.data;
   }).catch(function (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            result.send(error.response.status);
        } else if (error.request) {
            console.log(error.request);
            result.send(error.request)
        } else {
            console.log('Error', error.message);
            result.send('Error:' + error.message)
        }
        console.log(error.config);
    })

    result.send(responseData);
});

module.exports.route = route;