const express = require("express");
const { basename } = require('path');
const fs = require("fs");
const {urls} = require("../core/configuration/urls");
const url = require('url');
const path = require('path');

const route = express.Router();


route.get("/", async (req, res) => {
    res.redirect(301, urls.authentication.login_page());
});


module.exports.homepageRoute = route;