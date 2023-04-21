const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const {getAuthenticationServiceUrl} = require("../URLs/get-authentication-service-url");

const route = express.Router()

route.post("/", async (req, res) => {
   let response;
   try {
       response = await axios({
           url: getAuthenticationServiceUrl('/auth/validate-login'),
           method: 'post',
           data: {
               username: req.body.username,
               password: req.body.password,
           }
       });
   } catch (error) {
       if (error.response) {
           console.log(error.response.status);
           console.log(error.response.data);
           res.status(error.response.status).send(error.response.data);
       } else if (error.request) {
           console.log(error.request);
           res.status(408).send("No response from authentication service.");
       } else {
           console.log('Error:', error.message);
           res.status(400).send('Error: ' + error.message);
       }
       return -1;
   }

   console.log(response.data)
   let secretKey = process.env.JWT_SECRET_KEY;
   let token = jwt.sign(response.data, secretKey);
   console.log(token);
   console.log(jwt.verify(token, secretKey));
   res.send({'x-jwt-token': token})
});

module.exports.route = route;