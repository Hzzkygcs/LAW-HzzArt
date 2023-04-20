const axios = require("axios");
const {getLoginOrchestrationUrl} = require("../../../URLs/get-login-orchestration-url");

async function getUsernameFromJWT(token) {
    const url = getLoginOrchestrationUrl("/get-username-from-JWT");
    const response = await axios.post(url, {
        token: token
    });
    return response.data.username;
}

module.exports.getUsernameFromJWT = getUsernameFromJWT;