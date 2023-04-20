const express = require("express");
const axios = require("axios");

const route = express.Router()

route.post("/", async (request, result) => {
    const baseAuthURL = process.env.AUTHENTICATION_SERVICE_URL
    const response = await axios({
        url: '/auth/',
        method: 'post',
        baseURL: baseAuthURL,
        data: {
            username: request.body.username,
            password: request.body.password,
        }
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
});
