const {getAdminManagerUrl} = require("../../../URLs/get-admin-manager-url");
const {makeRequest} = require("../../external-call/make-request");

async function sendAdminManagementService(collectionId, reportedBy, ownerCollection, reason) {
    const url = getAdminManagerUrl("/admin/reported-collection");
    let response = await makeRequest("post",
        url,
        {
        "collectionId": collectionId,
        "reportedBy": reportedBy,
        "owner": ownerCollection,
        "reason": reason
        },
        {
            "x-service-token": process.env.ADMIN_SERVICE_TOKEN,
        }
    );
    return response.data;
}

module.exports.sendAdminManagementService = sendAdminManagementService;