const {getAdminManagerUrl} = require("../../../URLs/get-admin-manager-url");
const {makeRequest} = require("../../external-call/make-request");

async function getReportedCollections() {
    const url = getAdminManagerUrl("/admin/reported-collection");
    let response = await makeRequest("get",
        url,
        {},
        {
            "x-service-token": process.env.ADMIN_SERVICE_TOKEN,
        }
    );
    return response.data;
}

module.exports.getReportedCollections = getReportedCollections;