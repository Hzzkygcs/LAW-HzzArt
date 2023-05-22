const {getLikeCommentServiceUrl} = require("../../../URLs/get-like-comment-service-url");
const {makeRequest} = require("../../external-call/make-request");

async function sendCommentService (username, collectionId, token) {
    const url = await getLikeCommentServiceUrl("/like-comment/comment/");
    let response = await makeRequest("post",
        url+collectionId,
        {},
        {
            "x-jwt-token": token,
        })
    return response.data;
}

module.exports.sendRatingService = sendCommentService;