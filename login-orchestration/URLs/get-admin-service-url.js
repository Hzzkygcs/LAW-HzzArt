function getAdminServiceUrl(relativePath){
    const baseUrl = process.env.ADMIN_SERVICE_URL;
    return baseUrl + relativePath;
}

module.exports.getAdminServiceUrl = getAdminServiceUrl;