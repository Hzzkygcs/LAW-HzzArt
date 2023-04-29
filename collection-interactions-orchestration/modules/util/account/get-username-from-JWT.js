const {getLoginOrchestrationUrl} = require("../../../URLs/get-login-orchestration-url");
const {makeRequest} = require("../../external-call/make-request");

async function getUsernameFromJWT(token) {
    const url = getLoginOrchestrationUrl("/login/validate-login");
    let response = await makeRequest("post", url, {
        "x-jwt-token": token
    });
    return response.data;
}

module.exports.getUsernameFromJWT = getUsernameFromJWT;