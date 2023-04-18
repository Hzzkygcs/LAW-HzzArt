const Jimp = require('jimp');


async function blendImagesFromDisk(imgPath1, imgPath2, opacityProgress, outputPath) {
    const image1 = await Jimp.read(imagePath1);
    const image2 = await Jimp.read(imagePath2);

    const blendedImage = blendImages(image1, image2, opacityProgress, outputPath);
    blendedImage.write(outputPath);
}


async function blendImages(image1, image2, opacityProgress, outputPath) {
    image2.resize(image1.getWidth(), image1.getHeight());
    const blendedImage = new Jimp(image1.getWidth(), image1.getHeight());

    // Blend the two images using the specified opacities
    blendedImage.composite(image1, 0, 0, { opacity: opacityProgress });
    blendedImage.composite(image2, 0, 0, { opacity: 1 - opacityProgress });
    return blendedImage;
}

