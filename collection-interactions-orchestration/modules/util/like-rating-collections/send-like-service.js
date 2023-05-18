const {getLikeCommentServiceUrl} = require("../../../URLs/get-like-comment-service-url");
const {makeRequest} = require("../../external-call/make-request");

async function sendLikeService(username, collectionId, like) {
    const url = getLikeCommentServiceUrl("/like-collection");
    let response = await makeRequest("post", url, {
        "username": username,
        "collectionId": collectionId,
        "like": like
    })
    return response.data;
}

module.exports.sendLikeService = sendLikeService;