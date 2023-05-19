const express = require("express");
const {upload} = require("../config/files-uploading-multer");
const path = require("path");
const {defaultTmpOptions} = require("../config/tmp-options");
const tmp = require("tmp-promise");
const Jimp = require("jimp");
const {ContainCombineStrategy} = require("../services/strategies/image-combiner/image-combiner");
const {submitVideo} = require("../services/submit-video");
const {getTokenName} = require("../services/get-token-name");
const joi = require("joi");
const {generateValidationFunction} = require("../modules/joi-validate/generate-valdiation-function");
const {VideoTooLargeException} = require("../modules/exceptions/VideoTooLargeException");
const {ImageRequiredException} = require("../modules/exceptions/ImageRequiredException");
const fs = require('fs').promises;
const mmm = require('mmmagic');
const Magic = require('mmmagic').Magic;
const {promisify} = require('util');
const {InvalidImageException} = require("../modules/exceptions/InvalidImageException");

const route = express.Router();


const validationSchema = {
    fps: joi.number().required().integer().min(1).max(120),
    per_image_duration: joi.number().required().min(0.1),
    transition_duration: joi.number().required().min(0),
};
const validate = generateValidationFunction(validationSchema);


route.post("/submit-video", upload.any(), async function (req, res) {
    const {fps, per_image_duration, transition_duration} = validate({
        fps: req.body.fps,
        per_image_duration: req.body.per_image_duration,
        transition_duration: req.body.transition_duration,
    });
    const estimated_number_of_frames = fps * per_image_duration * transition_duration;
    if (estimated_number_of_frames > 9000){
        throw new VideoTooLargeException(estimated_number_of_frames);
    }
    if (req.files == null || req.files.length === 0){
        throw new ImageRequiredException();
    }

    console.log(`Received video-create request, from ${req.files.length} images`);


    const submittedFiles = preservedOrderImagePaths(req.files, "img");
    await validateMultipleImageType(submittedFiles);
    const token = await tmp.dir(defaultTmpOptions());  // token = path file
    submitVideo(submittedFiles, token.path, fps, per_image_duration, transition_duration).then(r => {});

    res.send({
        token: getTokenName(token.path)
    });
});


async function validateMultipleImageType(submittedFiles) {
    let id = 0;
    for (const submittedFile of submittedFiles) {
        await validateImageIsPngOrJpg(`img-${id}`, submittedFile);
        id++;
    }
}

async function validateImageIsPngOrJpg(imageId, filePath) {
    const mimeType = await getFileMimeType(filePath);
    const allowedMimeTypes = [
        "image/png",
        "image/jpeg",
    ]
    if (!allowedMimeTypes.includes(mimeType)){
        throw new InvalidImageException(imageId, mimeType);
    }
}


async function getFileMimeType(filePath) {
    const magic = new Magic(mmm.MAGIC_MIME_TYPE);
    return new Promise((resolve, reject) => {
        magic.detectFile(filePath, function (err, result) {
            if (err != null)
                return reject(err);
            return resolve(result);
        });
    });
}


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
    if (reqFiles.length !== ret.length){
        console.log(`Uploaded files length (${reqFiles.length}) and valid files length are not equal (${ret.length})! 
        reqFiles: ${JSON.stringify(reqFiles)}`)
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


module.exports.submitVideoRoute = route;