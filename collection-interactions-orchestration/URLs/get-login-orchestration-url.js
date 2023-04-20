function getLoginOrchestrationUrl(relativePath) {
    const baseUrl = process.env.LOGIN_ORCHESTRATION_URL;
    return baseUrl + relativePath;
}

module.exports.getLoginOrchestrationUrl = getLoginOrchestrationUrl;