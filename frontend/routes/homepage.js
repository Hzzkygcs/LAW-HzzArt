const express = require("express");
const { basename } = require('path');
const fs = require("fs");
const {urls} = require("../core/configuration/urls");
const url = require('url');
const path = require('path');
const {validateLoggedIn} = require("../services/validateLoggedIn");

const route = express.Router();


route.get("/", async (req, res) => {
    const temporaryRedirect = 302;
    const loginUser = await validateLoggedIn(req, res);
    console.log("-->",loginUser);
    res.cookie('userIsAdmin', loginUser.data.admin);
    if (!loginUser)
        return;
    if (loginUser.data.admin) {
        console.log("admin");
        res.redirect(temporaryRedirect, urls.adminHomepage());
    }
    else {
        console.log("not admin");
        res.redirect(temporaryRedirect, urls.homepage());
    }
});



module.exports.homepageRoute = route;