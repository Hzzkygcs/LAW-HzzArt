const {getAnyHealthyServiceHostName} = require("../config/consul");

async function getAdminServiceUrl(relativePath){
    let baseUrl = process.env.ADMIN_SERVICE_URL;
    baseUrl = await getAnyHealthyServiceHostName(process.env.ADMIN_SERVICE_NAME, baseUrl);
    console.log(`Getting ADMIN_SERVICE_URL: ` + baseUrl);
    return baseUrl + relativePath;
}

module.exports.getAdminServiceUrl = getAdminServiceUrl;