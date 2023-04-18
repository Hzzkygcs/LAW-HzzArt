const {ContainCombineStrategy} = require("./strategies/image-combiner/image-combiner");
const Jimp = require("jimp");
const path = require("path");
const {InvalidImageException} = require("../modules/exceptions/InvalidImageException");
const {promises: fs} = require("fs");
const {FadeImageTransitionStrategy} = require("./strategies/transition/image-blend");


module.exports.submitVideo = async function (submittedFiles, tokenAsPath) {
    const images = await getImagesWithNormalizedSize(submittedFiles);
    const imageFrameGenerator = new FadeImageTransitionStrategy(images, 5);
    imageFrameGenerator.setProgressReportEventHandler(
        (frameId, jimp) => {
            console.log(`Created frameId: ${frameId}`);
            jimp.write(path.join(tokenAsPath, `${frameId}.jpg`));
        }
    );
    await imageFrameGenerator.performUntilFinished(3, 2);

    await cleanUpFiles(submittedFiles);


};

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


async function cleanUpFiles(paths) {
    const promises=[];
    for (const path1 of paths) {
        promises.push(
            fs.unlink(path1)
        );
    }
    return Promise.all(promises);
}