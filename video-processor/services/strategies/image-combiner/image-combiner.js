const Jimp = require("jimp");

/**
 * abstract
 */
class ImageCombineStrategy{
    getResult(){
        // Abstract
    }
}




class ContainCombineStrategy extends ImageCombineStrategy{
    images=[];
    currentResultingWidth=0;
    currentResultingHeight=0;
    determineTargetSizeFromAverage=true;

    /**
     * @param {Jimp[]} images
     * @param {number} targetWidth
     * @param {number} targetHeight
     */
    constructor(images, targetWidth=null, targetHeight=null) {
        super();
        this.images = [];
        for (const image of images) {
            this.images.push(image.clone());
        }
        if (targetWidth == null || targetHeight == null){
            this.determineTargetSizeFromAverage = true;
            return;
        }
        this.currentResultingHeight = targetHeight;
        this.currentResultingWidth = targetWidth;
    }

    size(){
        return this.images.length;
    }

    getResult() {
        this._updateResultingSizeByTheAverage();
        let resultingImage = new Jimp(this.currentResultingWidth, this.currentResultingHeight);
        for (let imageIndex = 0; imageIndex < this.images.length; imageIndex++) {
            resultingImage = this.getResultForSpecificImage(imageIndex, resultingImage);
        }
        return resultingImage;
    }

    getResultForSpecificImage(imageIndex, baseImage=null){
        this._updateResultingSizeByTheAverage();
        baseImage = this._getJimpObjectFromTheFunction(baseImage);
        baseImage = baseImage ?? new Jimp(this.currentResultingWidth, this.currentResultingHeight);
        baseImage = baseImage.clone();

        const currImage = this.images[imageIndex];
        const image = this._containResize(currImage);
        const x = this._getHorizontalMiddlePosition(image);
        const y = this._getVerticalMiddlePosition(image);
        baseImage.composite(image, x, y);

        return baseImage;
    }

    _getJimpObjectFromTheFunction(func){
        if (typeof func !== 'function') {
            return func;
        }
        return func(this.currentResultingWidth, this.currentResultingHeight);
    }


    /**
     * @private
     */
    _updateResultingSizeByTheAverage(){
        if (!this.determineTargetSizeFromAverage)
            return;

        let heightSum = 0;
        let widthSum = 0;
        const images = this.images;
        for (const image of images) {
            widthSum += image.getWidth();
            heightSum += image.getHeight();
        }
        this.currentResultingHeight = heightSum/images.length;
        this.currentResultingWidth = widthSum/images.length;
    }

    _containResize(image){
        if (this._shouldResizeToMatchTheHeight(image))
            return this._resizeSourceImageToMatchTheHeight(image);
        return this._resizeSourceImageToMatchTheWidth(image);
    }

    _shouldResizeToMatchTheHeight(image){
        return this._getHeightSourceByDestinationRatio(image) > this._getWidthSourceByDestinationRatio(image);
    }

    /**
     * @param {Jimp} image
     * @private
     */
    _resizeSourceImageToMatchTheHeight(image){
        image = image.clone();
        const factor = 1 / this._getHeightSourceByDestinationRatio(image);
        const targetWidth = image.getWidth() * factor;
        const targetHeight = image.getHeight() * factor;
        image.resize(targetWidth, targetHeight);
        return image;
    }
    _resizeSourceImageToMatchTheWidth(image){
        image = image.clone();
        const factor = 1 / this._getWidthSourceByDestinationRatio(image);
        const targetWidth = image.getWidth() * factor;
        const targetHeight = image.getHeight() * factor;
        image.resize(targetWidth, targetHeight);
        return image;
    }


    _getWidthSourceByDestinationRatio(image){
        const sourceWidth = image.getWidth();
        const destWidth = this.currentResultingWidth;
        return sourceWidth / destWidth;
    }

    _getHeightSourceByDestinationRatio(image){
        const sourceHeight = image.getHeight();
        const destHeight = this.currentResultingHeight;
        return sourceHeight / destHeight;
    }

    _getHorizontalMiddlePosition(image){
        const width = image.getWidth();
        return (this.currentResultingWidth - width) / 2;
    }
    _getVerticalMiddlePosition(image){
        const height = image.getHeight();
        return (this.currentResultingHeight - height) / 2;
    }

}
module.exports.ContainCombineStrategy = ContainCombineStrategy;
