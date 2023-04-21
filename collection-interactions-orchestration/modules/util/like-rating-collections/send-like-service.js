const axios = require("axios");
const {getLikeRatingServiceUrl} = require("../../../URLs/get-like-rating-service-url");

async function sendLikeService(username, collectionId, like) {
    const url = getLikeRatingServiceUrl("/like-collection");
    const response = await axios.post(url, {
        username: username,
        collectionId: collectionId,
        like: like
    }).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    });
    return response;
}

module.exports.sendLikeService = sendLikeService;