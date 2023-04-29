const express = require("express");
const { basename } = require('path');
const fs = require("fs");
const {urls} = require("../core/configuration/urls");
const url = require('url');
const path = require('path');
const ejs = require('ejs');

const route = express.Router();


route.all("*", async (req, res) => {
    const parsed = url.parse(req.originalUrl);
    const fileUrl = parsed.pathname;
    if (!validateFileIsAllowed(res, fileUrl))
        return;

    const parsedFileUrl = path.parse(fileUrl);
    if (!validateExtensionFile(res, parsedFileUrl.ext))
        return;

    let fileLocation = path.join(parsedFileUrl.dir, parsedFileUrl.name) + ".ejs";
    fileLocation = removeLeadingSlash(fileLocation)
    if (!fileExists(res, fileLocation))
        return;



    res.locals = {
        urls: urls,
        req: req,
        root: require.main.filename,
    }
    res.render(fileLocation, {});
});

function validateFileIsAllowed(res, fileUrl) {
    if (!basename(fileUrl).startsWith("-")){
        return true
    }
    res.status(404);
    res.send("frontend page not found");
    return false;
}

function validateExtensionFile(res, extension) {
    if (extension === ".html"){
        return true;
    }
    res.status(404);
    res.send("frontend page not found");
    return false;
}


function removeLeadingSlash(fileLocation) {
    if (fileLocation[0] === "/" || fileLocation[0] === "\\")
        fileLocation = fileLocation.substring(1);
    return fileLocation;
}


function fileExists(res, fileLocation) {
    const workdir = path.dirname(require.main.filename);
    if (fs.existsSync(path.join(workdir, "templates", fileLocation))){
        return true;
    }
    res.status(404);
    res.send("page not found");
    return false;
}

module.exports.defaultRoute = route;