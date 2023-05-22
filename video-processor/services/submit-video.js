const {ContainCombineStrategy} = require("./strategies/image-combiner/image-combiner");
const Jimp = require("jimp");
const path = require("path");
const {InvalidImageException} = require("../modules/exceptions/InvalidImageException");
const {promises: fs} = require("fs");
const {FadeImageTransitionStrategy} = require("./strategies/transition/image-blend");
const {combineImagesToVideo} = require("./images-to-video");
const {videoProgressRepository, ProgressPhaseEnums} = require("../repository/video-processing-progress");
const {getTokenName} = require("./get-token-name");

/**
 * @param submittedFiles
 * @param tokenAsPath
 * @param {number} fps
 * @param {number} slideDuration
 * @param {number} transitionDuration
 * @returns {Promise<void>}
 */
module.exports.submitVideo = async function (submittedFiles, tokenAsPath, fps,
                                             slideDuration, transitionDuration) {
    const tokenName = getTokenName(tokenAsPath);
    videoProgressRepository.register(tokenName);

    const durationInSecond = await generateFolderOfImageFrames(
        submittedFiles, tokenAsPath, fps, slideDuration, transitionDuration);

    const outputFileName = await combineImagesToVideo(tokenAsPath, durationInSecond, tokenAsPath, "video.mp4", fps);
    videoProgressRepository.setProgress(tokenName, 100, ProgressPhaseEnums.DONE, outputFileName);

    await cleanUpUploadsFiles(submittedFiles);
    await cleanUpImagesInAFolder(tokenAsPath);
};


async function generateFolderOfImageFrames(submittedFiles, tokenAsPath, fps, slideDuration, transitionDuration) {
    const images = await getImagesWithNormalizedSize(submittedFiles);
    const imageFrameGenerator = new FadeImageTransitionStrategy(images, fps);
    imageFrameGenerator.planForWholeSlideshow(slideDuration, transitionDuration);
    const numberOfFrames = imageFrameGenerator.getEstimateNumberOfFrame();

    const tokenName = getTokenName(tokenAsPath);
    videoProgressRepository.setTotalNumberOfFrames(tokenName, numberOfFrames);

    imageFrameGenerator.setProgressReportEventHandler(
        getProgressEventHandler(numberOfFrames, tokenAsPath));
    await imageFrameGenerator.carryOutThePlans(false);
    return imageFrameGenerator.getEstimateTotalDuration();
}

function getProgressEventHandler(numberOfFrames, tokenAsPath) {
    const tokenName = getTokenName(tokenAsPath);

    return async (frameId, jimp) => {
        const numberOfFramesDone = frameId+1;
        const donePercentage = numberOfFramesDone*100 / numberOfFrames;
        await jimp.writeAsync(path.join(tokenAsPath, `${frameId}.png`));

        videoProgressRepository.setProgress(tokenName, donePercentage, ProgressPhaseEnums.GENERATING_VIDEO_FRAMES);
    };
}



async function getImagesWithNormalizedSize(filePaths) {
    const jimpPhotos = await imagePathsToJimp(filePaths);
    const combiner = new ContainCombineStrategy(jimpPhotos);
    const ret = [];
    for (let imageIndex = 0; imageIndex < combiner.size(); imageIndex++) {
        const img = combiner.getResultForSpecificImage(imageIndex, (w, h) => {
            return new Jimp(w, h, '#ffffff');
        });
        ret.push(img);
    }
    return ret;
}





async function imagePathsToJimp(imagePaths) {
    const ret = [];
    let id = 0;
    for (const imagePath of imagePaths) {
        try{
            ret.push(await Jimp.read(imagePath));
        }catch (e) {
            if (e.message.includes("end of stream"))
                throw new InvalidImageException(`img-${id}`);  // TODO
            throw e;
        }

        id++;
    }
    return ret;
}


async function cleanUpUploadsFiles(paths) {
    const promises=[];
    for (const path1 of paths) {
        promises.push(
            fs.unlink(path1)
        );
    }
    return Promise.all(promises);
}

async function cleanUpImagesInAFolder(targetDirectory) {
    let fileNames = await fs.readdir(targetDirectory);
    fileNames = fileNames.filter(fn => fn.endsWith('.png'));
    for (const fileName of fileNames) {
        await fs.unlink(path.join(targetDirectory, fileName));
    }
}