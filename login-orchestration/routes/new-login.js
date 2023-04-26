const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const {getAuthenticationServiceUrl} = require("../URLs/get-authentication-service-url");
const {getAdminServiceUrl} = require("../URLs/get-admin-service-url");
const route = express.Router();

route.post("/", async (req, res) => {
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


   let secretKey = process.env.JWT_SECRET_KEY;
   let token = jwt.sign(getUserResponse.data, secretKey);
   console.log(token);
   console.log(jwt.verify(token, secretKey));
   res.send({'x-jwt-token': token})
});

module.exports.route = route;