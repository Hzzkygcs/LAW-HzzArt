const {getArtCollectionsUrl} = require("../../../URLs/get-art-collections-url");
const {makeRequest} = require("../../external-call/make-request");

async function validateCollection(idCollection,token){
    const url = await getArtCollectionsUrl("/collections/");
    const header = {
            "x-jwt-token": token,
        };
    let response = await makeRequest("get",
        url + idCollection,
        {},
        header
    );
    console.log("validateCollection");
    console.log(response.data);
    console.log("HEADER");
    console.log(header);
    return response.data;
}

module.exports.validateCollection = validateCollection;