const {getAdminManagerUrl} = require('../../../URLs/get-admin-manager-url');
const {makeRequest} = require("../../external-call/make-request");

async function checkBanAccounts() {
    const url = await getAdminManagerUrl('/admin/check-account');
    let response = await makeRequest("get",
        url, {}, {}, {}
    );
    return response.data;
}

module.exports.checkBanAccounts = checkBanAccounts;