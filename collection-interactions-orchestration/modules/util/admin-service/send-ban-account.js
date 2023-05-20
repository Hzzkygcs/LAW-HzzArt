const {getAdminManagerUrl} = require("../../../URLs/get-admin-manager-url");
const {makeRequest} = require("../../external-call/make-request");

async function sendBanAccount(username, isBan) {
    const url = getAdminManagerUrl("/admin/ban-account");
    let response = await makeRequest("post",
        url,
        {
        "username": username,
        "isBan": isBan,
        },
        {
            "x-service-token": process.env.ADMIN_SERVICE_TOKEN,
        }
    );
    return response.data;
}

module.exports.sendBanAccount = sendBanAccount;