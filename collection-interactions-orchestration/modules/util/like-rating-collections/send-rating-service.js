const {getLikeCommentServiceUrl} = require("../../../URLs/get-like-comment-service-url");
const {makeRequest} = require("../../external-call/make-request");

async function sendRatingService (username, collectionId, rating) {
    const url = getLikeCommentServiceUrl("/rating-collection");
    let response = await makeRequest("post", url, {
        "username": username,
        "collectionId": collectionId,
        "rating": rating
    })
    return response.data;
}

module.exports.sendRatingService = sendRatingService;