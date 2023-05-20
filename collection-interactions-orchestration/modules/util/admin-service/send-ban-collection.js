const {getAdminManagerUrl} = require("../../../URLs/get-admin-manager-url");
const {makeRequest} = require("../../external-call/make-request");

async function sendBanCollection(collectionId, isBan) {
    const url = getAdminManagerUrl("/admin/ban-collection");
    let response = await makeRequest("post",
        url,
        {
        "collectionId": collectionId,
        "isBan": isBan,
        },
        {
            "x-service-token": process.env.ADMIN_SERVICE_TOKEN,
        }
    );
    return response.data;
}

module.exports.sendBanCollection = sendBanCollection;