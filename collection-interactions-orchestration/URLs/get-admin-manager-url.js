function getAdminManagerUrl(relativePath){
    const baseUrl = process.env.ADMIN_MANAGER_URL;
    return baseUrl + relativePath;
}

module.exports.getAdminManagerUrl = getAdminManagerUrl;