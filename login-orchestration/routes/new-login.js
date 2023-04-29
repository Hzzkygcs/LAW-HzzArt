const express = require("express");
const jwt = require("jsonwebtoken");
const {isUserBanned} = require("../service/is-user-banned");
const {getUser} = require("../service/get-user");
const {UserIsBanned} = require("../modules/exceptions/UserIsBanned");
const route = express.Router();

route.post("/", async (req, res) => {
   console.log("POST new login");

   const username = req.body.username;
   const password = req.body.password;
   let user = await getUser(username, password);

   if (await isUserBanned()) {
       throw new UserIsBanned(username);
   }

   let secretKey = process.env.JWT_SECRET_KEY;
   let token = jwt.sign(user, secretKey);
   console.log("Created token:\n" + token);
   res.send({'x-jwt-token': token})
});

module.exports.route = route;