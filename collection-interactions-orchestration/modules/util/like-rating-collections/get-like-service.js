const {getLikeCommentServiceUrl} = require("../../../URLs/get-like-comment-service-url");
const {makeRequest} = require("../../external-call/make-request");

async function getLikeService(username, collectionId, token) {
    const url = getLikeCommentServiceUrl("/like-comment/like/");
    let response = await makeRequest("get",
        url+collectionId,
        {},
        {
            "x-jwt-token": token,
        }
    );
    return response.data;
}

module.exports.getLikeService = getLikeService;