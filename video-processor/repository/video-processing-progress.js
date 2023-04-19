const {logProgress} = require("../services/log-progress");

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
    setProgress(tokenName, percentage, phase){
        this.videoProgress[tokenName].setProgress(percentage, phase);
    }

    setTotalNumberOfFrames(tokenName, totalFrames){
        this.videoProgress[tokenName].totalFrames = totalFrames;
    }

    /**
     * @param tokenName
     * @returns {Progress}
     */
    getProgress(tokenName){
        return this.videoProgress[tokenName];
    }
}
module.exports.videoProgressRepository = new VideoProcessingProgress();


class Progress{
    percentage = 0;
    phase = ProgressPhaseEnums.NOT_STARTED;
    tokenName=null;
    totalFrames=null;

    constructor(tokenName) {
        this.tokenName = tokenName;
        this.setProgress(0);
    }

    setProgress(percentage, phase=null){  // potential to be refactored
        this.phase = phase ?? this.phase;

        if (this.phase === ProgressPhaseEnums.NOT_STARTED)
            this.percentage = 0;
        else if (this.phase === ProgressPhaseEnums.GENERATING_VIDEO_FRAMES)
            this.percentage = percentage * 0.85;
        else if (this.phase === ProgressPhaseEnums.COMBINING_FRAMES)
            this.percentage = 85 + percentage * 0.1;
        else if (this.phase === ProgressPhaseEnums.CUTTING_VIDEO)
            this.percentage = 95 + percentage * 0.05;
        else{
            this.percentage = 100;
            console.assert(phase === ProgressPhaseEnums.DONE);
        }

        logProgress(
            this.tokenName, this.phase, percentage.toFixed(2), this.percentage.toFixed(2));
    }
}