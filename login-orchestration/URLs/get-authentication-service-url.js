const {getAnyHealthyServiceHostName} = require("../config/consul");

async function getAuthenticationServiceUrl(relativePath){
    let baseUrl = process.env.AUTHENTICATION_SERVICE_URL;
    baseUrl = await getAnyHealthyServiceHostName(process.env.AUTHENTICATION_SERVICE_NAME, baseUrl);
    console.log(`Getting AUTHENTICATION_SERVICE_URL: ` + baseUrl);
    return baseUrl + relativePath;
}

module.exports.getAuthenticationServiceUrl = getAuthenticationServiceUrl;