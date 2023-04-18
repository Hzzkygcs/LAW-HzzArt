const Jimp = require('jimp');



/**
 * abstract
 */
class ImageTransitionStrategy{
    getResultingImages(){
        // Abstract
    }
    currentSlideDuration(seconds){
        // Abstract
    }
    moveToNextSlide(seconds){
        // Abstract
    }

    planForWholeSlideshow(slideDuration, transitionDuration){
        // Abstract
    }

    size(){
        // abstract
    }


    setProgressReportEventHandler(func){}
}


class FadeImageTransitionStrategy extends ImageTransitionStrategy{
    currentImageIndex = 0;
    sourceImages;
    fps;
    resultingImages = [];
    plans = [];
    estimateNumberOfFrame=0;

    progressReportEventHandler = async (ind, jimp) => {};

    constructor(sourceImages, fps) {
        super();
        this.sourceImages = sourceImages;
        this.fps = fps;
    }

    getResultingImages(){
        return this.sourceImages;
    }

    planCurrentSlideDuration(seconds){
        this.estimateNumberOfFrame += this.fps * seconds;
        this.plans.push(async () => await this.currentSlideDuration(seconds));
    }

    async currentSlideDuration(seconds) {
        const totalFrame = this._getTotalFrame(seconds);
        const currImage = this._getCurrentImage();

        for (let frame = 0; frame < totalFrame; frame++) {
            const currFrame = currImage.clone();
            await this.progressReportEventHandler(this._getCurrentFrameId(), currFrame);
            this.resultingImages.push(currFrame);
        }
    }


    _getTotalFrame(seconds){
        return this.fps * seconds
    }

    _getCurrentImage(){
        return this.sourceImages[this.currentImageIndex];
    }
    _getNextImage(){
        return this.sourceImages[this.currentImageIndex+1];
    }
    _getCurrentFrameId(){
        return this.resultingImages.length;
    }
    _moveToNextImage(){
        this.currentImageIndex++;
    }

    planToMoveToNextSlide(seconds){
        this.estimateNumberOfFrame += this.fps * seconds;
        this.plans.push(async () => await this.moveToNextSlide(seconds));
    }

    async moveToNextSlide(transitionDurationInSecond){
        const totalFrame = this._getTotalFrame(transitionDurationInSecond);
        const currentImage = this._getCurrentImage();
        const nextImage = this._getNextImage();

        for (let frame = 0; frame < totalFrame; frame++) {
            const resultingImage = await blendImages(
                currentImage, nextImage, frame/totalFrame
            );
            await this.progressReportEventHandler(this._getCurrentFrameId(), resultingImage);
            this.resultingImages.push(resultingImage);
        }
        this._moveToNextImage();
    }

    async carryOutThePlans(clear=false){
        for (const plan of this.plans) {
            await plan();
        }
        if (!clear)
            return;
        this.plans = [];
        this.estimateNumberOfFrame = 0;
    }

    planForWholeSlideshow(slideDuration, transitionDuration, plan=true){
        this.planCurrentSlideDuration(slideDuration);

        for (let i = 0; i < this.size()-1; i++) {
            this.planToMoveToNextSlide(transitionDuration);
            this.planCurrentSlideDuration(slideDuration);
        }
    }

    size(){
        return this.sourceImages.length;
    }

    setProgressReportEventHandler(func){
        this.progressReportEventHandler = func;
    }

    getEstimateNumberOfFrame(){
        return this.estimateNumberOfFrame;
    }

    getEstimateTotalDuration(){
        return this.estimateNumberOfFrame / this.fps;
    }
}
module.exports.FadeImageTransitionStrategy = FadeImageTransitionStrategy;




async function blendImages(image1, image2, opacityProgress) {
    image1 = image1.clone();
    image1.composite(image2, 0, 0, {
        opacitySource: opacityProgress,
        opacityDest: 1 - opacityProgress,
    });
    return image1;
}

