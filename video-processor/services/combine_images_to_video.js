const fs = require('fs');
const {get_ffmpeg, get_ffmpeg_with_input} = require("./get_ffmpeg");

const MUSIC_DIR = "musics";
let music = 0;

module.exports.combine_images_to_video = async (imageDir, maxDuration, outputDir, output) => {
    return new Promise((resolve, reject) => {
        const imageFiles = fs.readdirSync(imageDir)
            .filter(file => file.endsWith('.jpg'));
        imageFiles.sort();

        const temp_output = `${outputDir}/temp.mp4`;
        const outputFile = `${outputDir}/${output}`;

        const command = get_ffmpeg()
            .on('start', function(commandLine) {
                console.log('Spawned ffmpeg with command: ' + commandLine);
            })
            .input(`${imageDir}/%03d.jpg`)
            .inputOptions(['-r 1/3', '-start_number 0'])
            .addInput(`${MUSIC_DIR}/${music}.mp3`)
            .videoCodec('libx264')
            .audioCodec('aac')
            .outputOptions(['-r 30', '-pix_fmt yuv420p', '-vf scale=1280:-2'])
            .output(temp_output)
            .on('error', (error) => {
                console.log("FFMPEG Error " + error);
                reject(error)
            })
            .on('end', () => {
                console.log("cutting duration");
                get_ffmpeg_with_input(temp_output)
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
            });
        command.run();

        music = (music + 1) % 3;
    });
}