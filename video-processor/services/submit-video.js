const {ContainCombineStrategy} = require("./strategies/image-combiner/image-combiner");
const Jimp = require("jimp");
const path = require("path");
const {InvalidImageException} = require("../modules/exceptions/InvalidImageException");
const {promises: fs} = require("fs");
const {FadeImageTransitionStrategy} = require("./strategies/transition/image-blend");
const {combineImagesToVideo} = require("./combineImagesToVideo");

/**
 * @param submittedFiles
 * @param tokenAsPath
 * @param {number} fps
 * @returns {Promise<void>}
 */
module.exports.submitVideo = async function (submittedFiles, tokenAsPath, fps) {
    const durationInSecond = await generateFolderOfImageFrames(submittedFiles, tokenAsPath, fps);
    console.log(`Video duration: ${durationInSecond}`);
    await combineImagesToVideo(tokenAsPath, durationInSecond, tokenAsPath, "video.mp4", fps);
    await cleanUpUploadsFiles(submittedFiles);
    await cleanUpImagesInAFolder(tokenAsPath);
};


async function generateFolderOfImageFrames(submittedFiles, tokenAsPath, fps) {
    const images = await getImagesWithNormalizedSize(submittedFiles);
    const imageFrameGenerator = new FadeImageTransitionStrategy(images, fps);
    imageFrameGenerator.planForWholeSlideshow(4, 3);
    const numberOfFrames = imageFrameGenerator.getEstimateNumberOfFrame();

    imageFrameGenerator.setProgressReportEventHandler(
        async (frameId, jimp) => {
            console.log(`Created frameId: ${frameId}, percentage: ${frameId*100 / numberOfFrames}`);
            await jimp.writeAsync(path.join(tokenAsPath, `${frameId}.png`), );
        }
    );
    await imageFrameGenerator.carryOutThePlans(false);
    return imageFrameGenerator.getEstimateTotalDuration();
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