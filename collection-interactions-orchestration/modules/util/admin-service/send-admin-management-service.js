const axios = require("axios");
const {getAdminManagerUrl} = require("../../../URLs/get-admin-manager-url");

function sendAdminManagementService(username, collectionId, reason) {
    const url = getAdminManagerUrl("/admin/reported-collection");

    axios.post(url, {
        username: username,
        collectionId: collectionId,
        reason: reason
    }).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    });
}

module.exports.sendAdminManagementService = sendAdminManagementService;