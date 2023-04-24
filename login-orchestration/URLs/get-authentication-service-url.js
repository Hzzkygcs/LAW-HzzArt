function getAuthenticationServiceUrl(relativePath){
    const baseUrl = process.env.AUTHENTICATION_SERVICE_URL;
    return baseUrl + relativePath;
}

module.exports.getAuthenticationServiceUrl = getAuthenticationServiceUrl;