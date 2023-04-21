const axios = require("axios");
const {getAdminManagerUrl} = require("../../../URLs/get-admin-manager-url");

async function sendAdminManagementService(reportedBy, collectionId, reason,res) {
    const url = getAdminManagerUrl("/admin/reported-collection");
    await axios.post(url, {
        collectionId: collectionId,
        reportedBy: reportedBy,
        owner:"b",
        reason: reason
    }).then((response) => {
        console.log(response.data);
        res.send(response.data);
    }).catch((error) => {
        console.log(error);
        res.send(error);
    });
}

module.exports.sendAdminManagementService = sendAdminManagementService;