const fs = require('fs');
const {getFfmpeg, getFfmpegWithInput, getFfmpegPath} = require("./get-ffmpeg");
const {getTokenName} = require("./get-token-name");
const {videoProgressRepository, ProgressPhaseEnums} = require("../repository/video-processing-progress");
const path = require("path");
const { spawn } = require("child_process");

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
    const outputFileName = await cutDurationOfVideo(
        temporaryVideoPath, maxDuration, resultingVideoPath,
        getFfmpegProgressHandler(tokenName, ProgressPhaseEnums.CUTTING_VIDEO));
    console.log(`${tokenName} DONE WITH OUTPUT FILE NAME ${outputFileName}`)

    music = (music + 1) % 3;
    return outputFileName;
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


const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))



// cut duration of the video because if we make a video, usually the music is longer than the video
// so the generated video will be as long as the song. We need to cut it to match the video's slideshow
async function cutDurationOfVideo(tempOutput, maxDuration, outputFile, progressEventHandler) {
    console.log("cutting duration");
    let started = false;

    async function commandLine(resolve) {
        await sleep(2000);
        if (started) {
            console.log(`Cutting video for ${tempOutput} has already been started. Cancelling *CMD* ffmpeg.`)
            return;
        }
        const newOutputName = outputFile.replace(".", "-2.");
        const cmd = (`"${getFfmpegPath()}" -ss 0 -i ${tempOutput} -max_muxing_queue_size 1024 `
            + `-y -t ${maxDuration} ${newOutputName}`);
        console.log('Spawned 2nd step (command prompt)  ffmpeg with command: ' + cmd);

        const ls = spawn("/bin/sh", ["-c", cmd]);
        let error = false;

        ls.stdout.on("data", data => {
            console.log(`stdout: ${data}`);
        });

        ls.stderr.on("data", data => {
            console.log(`stderr: ${data}`);
            error = true;
        });

        ls.on('error', (error) => {
            console.log(`error: ${error.message}`);
        });

        ls.on("close", code => {
            console.log(`child process exited with code ${code}`);
            // if (!error)
            resolve(newOutputName);
        });
    }

    return await new Promise((resolve, reject) => {
        getFfmpegWithInput(tempOutput)
            .on('start', function(commandLine) {
                console.log('Spawned 2nd (fluent ffmpeg) step ffmpeg with command: ' + commandLine);
            })
            .seekInput(0)
            .duration(maxDuration)
            .output(outputFile)
            .on('progress', (progress) => {
                started = true;
                progressEventHandler(progress);
            })
            .on('error', () => (error) => {
                console.log("FFMPEG Error " + error);
                reject(error)
            })
            .on('end', () => {
                resolve(outputFile);
            }).run();
        commandLine(resolve);
    });
}