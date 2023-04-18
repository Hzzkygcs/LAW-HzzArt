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

    performUntilFinished(slideDuration, transitionDuration){
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
    progressReportEventHandler = (ind, jimp) => {};

    constructor(sourceImages, fps) {
        super();
        this.sourceImages = sourceImages;
        this.fps = fps;
    }

    getResultingImages(){
        return this.sourceImages;
    }
    currentSlideDuration(seconds){
        const totalFrame = this._getTotalFrame(seconds);
        const currImage = this._getCurrentImage();

        for (let frame = 0; frame < totalFrame; frame++) {
            const currFrame = currImage.clone();
            this.progressReportEventHandler(this._getCurrentFrameId(), currFrame);
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

    async moveToNextSlide(transitionDurationInSecond){
        const totalFrame = this._getTotalFrame(transitionDurationInSecond);
        const currentImage = this._getCurrentImage();
        const nextImage = this._getNextImage();

        for (let frame = 0; frame < totalFrame; frame++) {
            const resultingImage = await blendImages(
                currentImage, nextImage, frame/totalFrame
            );
            this.progressReportEventHandler(this._getCurrentFrameId(), resultingImage);
            this.resultingImages.push(resultingImage);
        }
        this._moveToNextImage();
    }

    async  performUntilFinished(slideDuration, transitionDuration){
        this.currentSlideDuration(slideDuration);

        for (let i = 0; i < this.size(); i++) {
            await this.moveToNextSlide(transitionDuration);
            this.currentSlideDuration(slideDuration);
        }
    }

    size(){
        return this.sourceImages.length;
    }

    setProgressReportEventHandler(func){
        this.progressReportEventHandler = func;
    }
}
module.exports.FadeImageTransitionStrategy = FadeImageTransitionStrategy;




async function blendImages(image1, image2, opacityProgress) {
    const blendedImage = new Jimp(image1.getWidth(), image1.getHeight());

    // Blend the two images using the specified opacities
    blendedImage.composite(image1, 0, 0, {
        opacity: opacityProgress
    });
    blendedImage.composite(image2, 0, 0, {
        opacity: 1 - opacityProgress
    });
    return blendedImage;
}

