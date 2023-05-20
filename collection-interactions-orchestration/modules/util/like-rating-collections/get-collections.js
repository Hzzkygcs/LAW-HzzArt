const {getLikeCommentServiceUrl} = require('../../../URLs/get-like-comment-service-url');
const {makeRequest} = require("../../external-call/make-request");

async function getCollections(search) {
  const url = getLikeCommentServiceUrl('/get-like-rating-collections');
  let response = await makeRequest("get", url, {
    params: {
        "search": search
    }
  })
    return response.data;
}

module.exports.getCollections = getCollections;