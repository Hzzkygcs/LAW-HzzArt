const {getAnyHealthyServiceHostName} = require("../config/consul");

async function getLoginOrchestrationUrl(relativePath) {
    let baseUrl = process.env.LOGIN_ORCHESTRATION_URL;
    baseUrl = await getAnyHealthyServiceHostName(process.env.LOGIN_ORCHESTRATION_NAME, baseUrl);
    return baseUrl + relativePath;
}

module.exports.getLoginOrchestrationUrl = getLoginOrchestrationUrl;