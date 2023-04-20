const axios = require("axios");
const {getAdminManagerUrl} = require("../../../URLs/get-admin-manager-url");

async function sendAdminManagementService(username, collectionId, reason) {
    const url = getAdminManagerUrl("/admin/reported-collection");
    const response = await axios.post(url, {
        username: username,
        collectionId: collectionId,
        reason: reason
    }).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    });
    return response;
}

module.exports.sendAdminManagementService = sendAdminManagementService;