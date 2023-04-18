const fs = require('fs');
const {get_ffmpeg, get_ffmpeg_with_input} = require("./get_ffmpeg");

const MUSIC_DIR = "musics";
let music = 0;

module.exports.combineImagesToVideo = async (imageDir, maxDuration, outputDir, output, fps) => {
    return new Promise((resolve, reject) => {
        const imageFiles = fs.readdirSync(imageDir)
            .filter(file => file.endsWith('.jpg'));
        imageFiles.sort();
        generateVideoFromMultiplePhotos(imageDir, outputDir, output, maxDuration, fps, resolve, reject);
        music = (music + 1) % 3;
    });
}


function generateVideoFromMultiplePhotos(imageDir, outputDir, output, maxDuration, fps, resolve, reject) {
    const tempOutput = `${outputDir}/temp.mp4`;
    const outputFile = `${outputDir}/${output}`;

    const command = get_ffmpeg()
        .on('start', function(commandLine) {
            console.log('Spawned ffmpeg with command: ' + commandLine);
        })
        .input(`${imageDir}/%d.png`)
        .inputOptions([`-r ${fps}`, '-start_number 0'])
        .addInput(`${MUSIC_DIR}/${music}.mp3`)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([`-r ${fps}`, '-pix_fmt yuv420p', '-vf scale=1280:-2'])
        .output(tempOutput)
        .on('error', (error) => {
            console.log("FFMPEG Error " + error);
            reject(error)
        })
        .on('end', () => {
            cutDurationOfVideo(tempOutput, maxDuration, outputFile, resolve, reject);
        });
    command.run();
}


function cutDurationOfVideo(tempOutput, maxDuration, outputFile, resolve, reject) {
    console.log("cutting duration");
    get_ffmpeg_with_input(tempOutput)
        .on('start', function(commandLine) {
            console.log('Spawned 2nd step ffmpeg with command: ' + commandLine);
        })
        .seekInput(0)
        .duration(maxDuration)
        .output(outputFile)
        .on('error', () => (error) => {
            console.log("FFMPEG Error " + error);
            reject(error)
        })
        .on('end', () => {
            resolve(outputFile);
        }).run();
}