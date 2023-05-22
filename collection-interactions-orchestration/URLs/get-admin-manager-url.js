const {getAnyHealthyServiceHostName} = require("../config/consul");

async function getAdminManagerUrl(relativePath){
    let baseUrl = process.env.ADMIN_SERVICE_URL;
    baseUrl = await getAnyHealthyServiceHostName(process.env.ADMIN_SERVICE_NAME, baseUrl);
    return baseUrl + relativePath;
}

module.exports.getAdminManagerUrl = getAdminManagerUrl;