const {getAdminManagerUrl} = require('../../../URLs/get-admin-manager-url');
const {makeRequest} = require("../../external-call/make-request");

async function checkBanCollections(collections) {
    const url = getAdminManagerUrl('/admin/check-collection');
    let response = await makeRequest("get", url, {
        params: {
            "collections": collections
        }
    })
    return response.data;
}

module.exports.checkBanCollections = checkBanCollections;