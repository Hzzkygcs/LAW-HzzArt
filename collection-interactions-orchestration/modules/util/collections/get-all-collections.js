const {getArtCollectionsUrl} = require('../../../URLs/get-art-collections-url');
const {makeRequest} = require("../../external-call/make-request");

async function getAllCollections() {
  const url = getArtCollectionsUrl('/get-all-collections');
  let response = await makeRequest("get", url)
    return response.data;
}

module.exports.getAllCollections = getAllCollections;