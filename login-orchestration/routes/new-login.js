const express = require("express");
const jwt = require("jsonwebtoken");
const {getUserRoleAndBanStatus} = require("../service/get-user-role-and-ban-status");
const {getUserAuthInformation} = require("../service/get-user-auth-information");
const {UserIsBanned} = require("../modules/exceptions/UserIsBanned");
const route = express.Router();

route.post("/", async (req, res) => {
   console.log("POST new login");

   const username = req.body.username;
   const password = req.body.password;
   let user = await getUserAuthInformation(username, password);

   const userStatus = await getUserRoleAndBanStatus();
   if (userStatus.banned) {
       throw new UserIsBanned(username);
   }
   user.admin = userStatus.admin;

   let secretKey = process.env.JWT_SECRET_KEY;
   let token = jwt.sign(user, secretKey);
   console.log("Created token:\n" + token);
   res.send({'x-jwt-token': token})
});

module.exports.route = route;