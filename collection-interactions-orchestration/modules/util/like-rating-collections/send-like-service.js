const {getLikeRatingServiceUrl} = require("../../../URLs/get-like-rating-service-url");
const {makeRequest} = require("../../external-call/make-request");

async function sendLikeService(username, collectionId, like) {
    const url = getLikeRatingServiceUrl("/like-collection");
    let response = await makeRequest("post", url, {
        "username": username,
        "collectionId": collectionId,
        "like": like
    })
    return response.data;
}

module.exports.sendLikeService = sendLikeService;