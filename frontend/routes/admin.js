const express = require("express");
const { basename } = require('path');
const fs = require("fs");
const {urls} = require("../core/configuration/urls");
const url = require('url');
const path = require('path');
const {validateLoggedIn} = require("../services/validateLoggedIn");

const route = express.Router();


route.get("/admin", async (req, res) => {
    const temporaryRedirect = 302;
    if (!await validateLoggedIn(req, res))
        return;
    res.redirect(temporaryRedirect, urls.adminHomepage());

});



module.exports.adminRoute = route;