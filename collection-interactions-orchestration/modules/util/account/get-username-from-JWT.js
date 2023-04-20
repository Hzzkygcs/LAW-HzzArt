const axios = require("axios");
const {getLoginOrchestrationUrl} = require("../../../URLs/get-login-orchestration-url");

async function getUsernameFromJWT(token) {
    const url = getLoginOrchestrationUrl("/auth/validate-login");
    const response = await axios.post(url, {
        token: token
    }).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    });
    return response.data.username;
}

module.exports.getUsernameFromJWT = getUsernameFromJWT;