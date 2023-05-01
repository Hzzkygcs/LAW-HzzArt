const {getLikeRatingServiceUrl} = require('../../../URLs/get-like-rating-service-url');
const {makeRequest} = require("../../external-call/make-request");

async function getPopularCollections(search) {
  const url = getLikeRatingServiceUrl('/get-like-rating-collections');
  let response = await makeRequest("get", url, {
    params: {
        "search": search
    }
  })
    return response.data;
}

module.exports.getPopularCollections = getPopularCollections;