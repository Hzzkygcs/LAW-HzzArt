const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const {getAuthenticationServiceUrl} = require("../URLs/get-authentication-service-url");
const {isUserBanned} = require("../service/isUserBanned");
const route = express.Router();

route.post("/", async (req, res) => {
   console.log("POST new login");
   let getUserResponse;
   try {
       getUserResponse = await axios({
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
   console.log(getUserResponse.data);

   let username = getUserResponse.data.username;
   let checkUserResponse = await isUserBanned(username);
   if (checkUserResponse.status !== 200) {
       res.status(checkUserResponse.status).send(checkUserResponse.message);
       return -1;
   }
   if (checkUserResponse.isBan) {
       res.status(403).send("User is banned.");
       return -1;
   }


   let secretKey = process.env.JWT_SECRET_KEY;
   let token = jwt.sign(getUserResponse.data, secretKey);
   console.log("Created token:\n" + token);
   res.send({'x-jwt-token': token})
});

module.exports.route = route;