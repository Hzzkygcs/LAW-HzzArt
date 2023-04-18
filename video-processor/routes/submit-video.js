const express = require("express");
const {upload} = require("../config/files-uploading-multer");
const path = require("path");
const route = express.Router();


route.post("/submit-video", upload.any(), function (req, res) {
    const submittedFiles = getOrderedImagePaths(req.files, "img")
    console.log(submittedFiles);
    res.send({
        answer: 'success'
    });
});

function getOrderedImagePaths(reqFiles, fieldNamePrefix) {
    const ret = [];

    let i = 0;
    while (true){
        const fieldName = `${fieldNamePrefix}-${i}`;
        const fileNames = getImagePaths(reqFiles, fieldName);
        if (fileNames.length === 0)
            break;
        ret.push(...fileNames);
        i++;
    }
    return ret;
}

function getImagePaths(reqFiles, fieldName) {
    const ret = [];

    for (const reqFile of reqFiles) {
        if (reqFile.fieldname != fieldName)
            continue;
        const {path} = reqFile;
        ret.push(path);
    }
    return ret;
}


module.exports.submit_video_route = route;