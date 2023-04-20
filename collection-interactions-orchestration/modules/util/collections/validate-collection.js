const axios = require("axios");
const {getArtCollectionsUrl} = require("../../../URLs/get-art-collections-url");

async function validateCollection(idCollection){
    const url = getArtCollectionsUrl("validate-collection");
    const response = await axios.post(url, {
        idCollection: idCollection
    });
    return response.data;
}

module.exports.validateCollection = validateCollection;