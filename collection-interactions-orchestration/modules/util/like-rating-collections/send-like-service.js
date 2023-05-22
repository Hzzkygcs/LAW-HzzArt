const {getLikeCommentServiceUrl} = require("../../../URLs/get-like-comment-service-url");
const {makeRequest} = require("../../external-call/make-request");

async function sendLikeService(username, collectionId, token) {
    const url = await getLikeCommentServiceUrl("/like-comment/like/");
    let response = await makeRequest("post",
        url+collectionId,
        {},
        {
            "x-jwt-token": token,
        }
    );
    return response.data;
}

module.exports.sendLikeService = sendLikeService;