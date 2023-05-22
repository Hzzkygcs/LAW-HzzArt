const {getAdminManagerUrl} = require('../../../URLs/get-admin-manager-url');
const {makeRequest} = require("../../external-call/make-request");

async function checkBanCollections() {
    const url = await getAdminManagerUrl('/admin/check-collection');
    let response = await makeRequest("get",
        url, {}, {}, {}
    );
    return response.data;
}

module.exports.checkBanCollections = checkBanCollections;