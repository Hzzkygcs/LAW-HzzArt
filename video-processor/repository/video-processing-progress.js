const {logProgress} = require("../services/log-progress");
const {token} = require("morgan");
const {TokenNotFoundException} = require("../modules/exceptions/TokenNotFoundException");
const {VideoNotFinishedYetException} = require("../modules/exceptions/VideoNotDoneYetException");
const {InternalServerErrorException} = require("../modules/exceptions/InternalServerErrorException");

const ProgressPhaseEnums = {
    NOT_STARTED: "not-started",
    GENERATING_VIDEO_FRAMES: "generating-frames",
    COMBINING_FRAMES: "combining-frames",
    CUTTING_VIDEO: "cutting-video",
    DONE: "done",
};
module.exports.ProgressPhaseEnums = Object.freeze(ProgressPhaseEnums);




class VideoProcessingProgress{
    videoProgress = {};

    register(tokenName){
        this.videoProgress[tokenName] = new Progress(tokenName);
    }
    setProgress(tokenName, percentage, phase, outputFileName=null){
        this.videoProgress[tokenName].setProgress(percentage, phase, outputFileName);
    }

    setTotalNumberOfFrames(tokenName, totalFrames){
        this.videoProgress[tokenName].totalFrames = totalFrames;
    }

    /**
     * @param tokenName
     * @returns {Progress}
     */
    getProgress(tokenName){
        this.validateTokenExists(tokenName);

        return this.videoProgress[tokenName];
    }

    validateTokenExists(tokenName){
        const tokenNotFound = !(tokenName in this.videoProgress);
        if (tokenNotFound)
            throw new TokenNotFoundException(tokenName);
    }
    validateFinished(tokenName){
        this.validateTokenExists(tokenName);
        const progress = this.getProgress(tokenName);
        if (progress.phase !== ProgressPhaseEnums.DONE)
            throw new VideoNotFinishedYetException(tokenName, progress);
        return progress;
    }
}
module.exports.videoProgressRepository = new VideoProcessingProgress();


class Progress{
    percentageTotal = 0;
    percentagePhase = 0;
    outputFileName=null;

    phase = ProgressPhaseEnums.NOT_STARTED;
    tokenName=null;
    totalFrames=null;

    constructor(tokenName) {
        this.tokenName = tokenName;
        this.setProgress(0);
    }

    setProgress(percentage, phase=null, outputFileName=null){  // potential to be refactored
        if (this.phase === ProgressPhaseEnums.DONE && phase !== ProgressPhaseEnums.DONE){
            console.log("TRYING TO REWRITE DONE STATUS TO NOT DONE\nTRYING TO REWRITE DONE STATUS TO NOT DONE");
            return;
        }
        if (this.phase === ProgressPhaseEnums.DONE){
            console.log("CANNOT UNDO DONE PROGRESS");
            return;
        }
        this.phase = phase ?? this.phase;

        if (this.phase === ProgressPhaseEnums.NOT_STARTED)
            this.percentageTotal = 0;
        else if (this.phase === ProgressPhaseEnums.GENERATING_VIDEO_FRAMES)
            this.percentageTotal = percentage * 0.85;
        else if (this.phase === ProgressPhaseEnums.COMBINING_FRAMES)
            this.percentageTotal = 85 + percentage * 0.1;
        else if (this.phase === ProgressPhaseEnums.CUTTING_VIDEO)
            this.percentageTotal = 95 + percentage * 0.05;
        else{
            this.percentageTotal = 100;
            console.assert(phase === ProgressPhaseEnums.DONE);
        }
        this.percentagePhase = percentage;
        this.outputFileName = outputFileName;

        if (this.percentageTotal > 100)
            this.percentageTotal = 100;
        if (this.percentagePhase > 100)
            this.percentagePhase = 100;
        if (this.phase === ProgressPhaseEnums.DONE && outputFileName === null) {
            throw new InternalServerErrorException("outputFileName is null when the video is done!")
        }

        logProgress(
            this.tokenName, this.phase,
            percentage.toFixed(2),
            this.percentageTotal.toFixed(2));
    }
}