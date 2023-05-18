const {getArtCollectionsUrl} = require("../../../URLs/get-art-collections-url");
const {makeRequest} = require("../../external-call/make-request");

async function validateCollection(idCollection,token){
    const url = getArtCollectionsUrl("/collections/");
    return await makeRequest("get",
        url + idCollection,
        {},
        {
            "x-jwt-token": token,
        }
    );
}

module.exports.validateCollection = validateCollection;