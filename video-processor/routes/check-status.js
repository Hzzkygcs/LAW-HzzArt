const {upload} = require("../config/files-uploading-multer");
const tmp = require("tmp-promise");
const {defaultTmpOptions} = require("../config/tmp-options");
const {submitVideo} = require("../services/submit-video");
const {getTokenName} = require("../services/get-token-name");
const express = require("express");
const joi = require("joi");
const {generateValidationFunction} = require("../modules/joi-validate/generate-valdiation-function");
const {videoProgressRepository} = require("../repository/video-processing-progress");


const route = express.Router();


const validationSchema = {
    token: joi.string().required(),
};
const validate = generateValidationFunction(validationSchema);



route.get("/check-status/:tokenName", async function (req, res) {
    const {token} = validate({
        token: req.params.tokenName
    });

    res.send(videoProgressRepository.getProgress(token));
});

module.exports.checkStatusRoute = route;