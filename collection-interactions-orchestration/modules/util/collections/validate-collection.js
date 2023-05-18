const {getArtCollectionsUrl} = require("../../../URLs/get-art-collections-url");
const {makeRequest} = require("../../external-call/make-request");

async function validateCollection(idCollection,token){
    const url = getArtCollectionsUrl("/collections/");
    let response = await makeRequest("get",
        url + idCollection,
        {},
        {
            "x-jwt-token": token,
        }
    );
    return response.data;
}

module.exports.validateCollection = validateCollection;