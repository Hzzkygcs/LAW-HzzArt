

module.exports.logProgress = function (tokenName, phase, phasePercentageDone, totalPercentageDone) {
    console.log(`${tokenName} ${phase}: ${phasePercentageDone}%. Total done: ${totalPercentageDone}%`);
}