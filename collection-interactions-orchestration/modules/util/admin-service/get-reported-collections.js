const {getAdminManagerUrl} = require("../../../URLs/get-admin-manager-url");
const {makeRequest} = require("../../external-call/make-request");

async function getReportedCollections() {
    const url = await getAdminManagerUrl("/admin/reported-collection");
    let response = await makeRequest("get",
        url,
        {},
        {
            "x-service-token": process.env.ADMIN_SERVICE_TOKEN,
        }
    );
    return response.data;
}

async function getDetailsReportedCollections(collectionId) {
    const url = await getAdminManagerUrl("/admin/reported-collection/" + collectionId);
    let response = await makeRequest("get",
        url,
        {},
        {
            "x-service-token": process.env.ADMIN_SERVICE_TOKEN,
        }
    );
    console.log(response.data);
    return response.data;
}

module.exports = {getReportedCollections,getDetailsReportedCollections};