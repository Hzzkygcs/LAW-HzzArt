const axios = require("axios");
const {getLikeRatingServiceUrl} = require("../../../URLs/get-like-rating-service-url");

async function sendRatingService (username, collectionId, rating) {
    const url = getLikeRatingServiceUrl("/rating-collection");
    const response = await axios.post(url, {
        username: username,
        collectionId: collectionId,
        rating: rating
    }).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    });
    return response;
}

module.exports.sendRatingService = sendRatingService;