const {getArtCollectionsUrl} = require("../../../URLs/get-art-collections-url");
const {makeRequest} = require("../../external-call/make-request");

async function validateCollection(idCollection){
    const url = getArtCollectionsUrl("/validate-collection");
    let response = await makeRequest("post", url, {
        "idCollection": idCollection
    })
    return response.data;
}

module.exports.validateCollection = validateCollection;