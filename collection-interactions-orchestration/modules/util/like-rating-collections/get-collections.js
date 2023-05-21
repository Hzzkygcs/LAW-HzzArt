const {getArtCollectionsUrl} = require('../../../URLs/get-art-collections-url');
const {makeRequest} = require("../../external-call/make-request");

async function getCollections(search,token) {
  const url = getArtCollectionsUrl('/collections/search');
  let response = await makeRequest("post", url,
      {
        "name": search
  },
      {
          "x-jwt-token": token
      })
    return response.data;
}

module.exports.getCollections = getCollections;