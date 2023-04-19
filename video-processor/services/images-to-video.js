const fs = require('fs');
const {getFfmpeg, getFfmpegWithInput} = require("./get-ffmpeg");
const {getTokenName} = require("./get-token-name");
const {videoProgressRepository, ProgressPhaseEnums} = require("../repository/video-processing-progress");
const path = require("path");
const {logProgress} = require("./log-progress");

const MUSIC_DIR = "musics";
let music = 0;

module.exports.combineImagesToVideo = async (tokenAsPath, maxDuration, outputDir, output, fps) => {
    const imageFiles = fs.readdirSync(tokenAsPath)
        .filter(file => file.endsWith('.jpg'));
    imageFiles.sort();

    const tokenName = getTokenName(tokenAsPath);
    const temporaryVideoPath = await generateVideoFromMultiplePhotos(
        tokenAsPath, path.join(outputDir, "temp.mp4"), fps,
        getFfmpegProgressHandler(tokenName, ProgressPhaseEnums.COMBINING_FRAMES));

    const resultingVideoPath = path.join(outputDir, output);
    await cutDurationOfVideo(
        temporaryVideoPath, maxDuration, resultingVideoPath,
        getFfmpegProgressHandler(tokenName, ProgressPhaseEnums.CUTTING_VIDEO));


    music = (music + 1) % 3;
}

function getFfmpegProgressHandler(tokenName, phase) {
    return (progress) => {
        const currentProgress = videoProgressRepository.getProgress(tokenName);

        const percentageDone = 100 * progress.frames / currentProgress.totalFrames;
        currentProgress.setProgress(percentageDone, phase);
    };
}

function generateVideoFromMultiplePhotos(imageDir, outputName, fps, progressEventHandler) {
    return new Promise((resolve, reject) => {
        getFfmpeg()
            .on('start', function(commandLine) {
                console.log('Spawned ffmpeg with command: ' + commandLine);
            })
            .input(`${imageDir}/%d.png`)
            .inputOptions([`-r ${fps}`, '-start_number 0'])
            .addInput(`${MUSIC_DIR}/${music}.mp3`)
            .videoCodec('libx264')
            .audioCodec('aac')
            .outputOptions([`-r ${fps}`, '-pix_fmt yuv420p', '-vf scale=1280:-2'])
            .output(outputName)
            .on('progress', progressEventHandler)
            .on('error', (error) => {
                console.log("FFMPEG Error " + error);
                reject(error)
            })
            .on('end', () => {
                resolve(outputName);
            })
            .run();
    });
}





// cut duration of the video because if we make a video, usually the music is longer than the video
// so the generated video will be as long as the song. We need to cut it to match the video's slideshow
function cutDurationOfVideo(tempOutput, maxDuration, outputFile, progressEventHandler) {
    console.log("cutting duration");
    return new Promise((resolve, reject) => {
        getFfmpegWithInput(tempOutput)
            .on('start', function(commandLine) {
                console.log('Spawned 2nd step ffmpeg with command: ' + commandLine);
            })
            .seekInput(0)
            .duration(maxDuration)
            .output(outputFile)
            .on('progress', progressEventHandler)
            .on('error', () => (error) => {
                console.log("FFMPEG Error " + error);
                reject(error)
            })
            .on('end', () => {
                resolve(outputFile);
            }).run();
    });
}