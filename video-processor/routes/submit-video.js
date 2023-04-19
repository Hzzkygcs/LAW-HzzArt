const express = require("express");
const {upload} = require("../config/files-uploading-multer");
const path = require("path");
const {defaultTmpOptions} = require("../config/tmp-options");
const tmp = require("tmp-promise");
const Jimp = require("jimp");
const {ContainCombineStrategy} = require("../services/strategies/image-combiner/image-combiner");
const {submitVideo} = require("../services/submit-video");
const {getTokenName} = require("../services/get-token-name");
const fs = require('fs').promises;

const route = express.Router();


route.post("/submit-video", upload.any(), async function (req, res) {
    const submittedFiles = preservedOrderImagePaths(req.files, "img")
    const token = await tmp.dir(defaultTmpOptions());  // token = path file
    submitVideo(submittedFiles, token.path, parseInt(req.body.fps)).then(r => {});

    res.send(getTokenName(token.path));
});



function preservedOrderImagePaths(reqFiles, fieldNamePrefix) {
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
        if (reqFile.fieldname !== fieldName)
            continue;
        const {path} = reqFile;
        ret.push(path);
    }
    return ret;
}


module.exports.submit_video_route = route;