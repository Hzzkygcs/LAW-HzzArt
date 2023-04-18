const Jimp = require("jimp");

/**
 * abstract
 */
class ImageCombineStrategy{
    getResult(){
        // Abstract
    }
}




class CoverCombineStrategy extends ImageCombineStrategy{
    images=[];
    currentResultingWidth=0;
    currentResultingHeight=0;
    resultingImage = null;

    constructor(images) {
        super();
        this.images = images;
    }

    getResult() {
        this._updateResultingSizeByTheAverage();
        this.resultingImage = new Jimp(this.currentResultingWidth, this.currentResultingHeight);

    }

    /**
     * @private
     */
    _updateResultingSizeByTheAverage(){
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



    _shouldResizeToMatchTheHeight(image){
        return this._getHeightSourceByDestinationRatio(image) > this._getWidthSourceByDestinationRatio(image);
    }

    _resizeSourceImageToMatchTheHeight(image){
        const factor = 1 / this._getHeightSourceByDestinationRatio(image);
        const targetWidth = image.get
        // TODO
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

}
