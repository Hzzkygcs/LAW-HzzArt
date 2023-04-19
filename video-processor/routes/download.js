const {upload} = require("../config/files-uploading-multer");
const tmp = require("tmp-promise");
const {defaultTmpOptions} = require("../config/tmp-options");
const {submitVideo} = require("../services/submit-video");
const {getTokenName} = require("../services/get-token-name");
const express = require("express");
const joi = require("joi");
const {generateValidationFunction} = require("../modules/joi-validate/generate-valdiation-function");
const {videoProgressRepository} = require("../repository/video-processing-progress");
const path = require("path");
const fs = require("fs").promises;
const createReadStream = require("fs").createReadStream;


const route = express.Router();


const validationSchema = {
    token: joi.string().required(),
};
const validate = generateValidationFunction(validationSchema);



route.get("/download/:tokenName", async function (req, res) {
    const {token} = validate({
        token: req.params.tokenName
    });
    videoProgressRepository.validateFinished(token);

    const videoPath = path.join(process.cwd(), "temp", token, "video.mp4")
    const stat = await fs.stat(videoPath)
    const fileSize = stat.size
    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head);
    createReadStream(videoPath).pipe(res);
});

module.exports.downloadRoute = route;