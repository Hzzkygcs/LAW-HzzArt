const axios = require('axios');
const {getArtCollectionsUrl} = require('../../../URLs/get-art-collections-url');
const {makeRequest} = require("../../external-call/make-request");

async function getNameImgCollections(collections) {
    const url = await getArtCollectionsUrl('/get-name-img-collections');
    let response = await makeRequest("get", url, {
        params: {
            collections: collections
        }
    })
    return response.data;
}

module.exports.getNameImgCollections = getNameImgCollections;