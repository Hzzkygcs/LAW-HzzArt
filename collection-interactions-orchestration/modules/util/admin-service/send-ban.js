const {getAdminManagerUrl} = require("../../../URLs/get-admin-manager-url");
const {makeRequest} = require("../../external-call/make-request");

async function sendBanAccount(username) {
    const url = await getAdminManagerUrl("/admin/ban-account");
    let response = await makeRequest("post",
        url,
        {
        "username": username,
        "isBan": true,
        },
        {
            "x-service-token": process.env.ADMIN_SERVICE_TOKEN,
        }
    );
    return response.data;
}

async function reportAcceptReject(collectionId,isBan) {
    const url = await getAdminManagerUrl("/admin/ban-collection");
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

module.exports = {sendBanAccount, reportAcceptReject};