const axios = require("axios");
const {getLikeRatingServiceUrl} = require("../../../URLs/get-like-rating-service-url");

async function sendRatingService (username, collectionId, rating) {
    const url = getLikeRatingServiceUrl("/rating-collection");

    await axios.post(url, {
        username: username,
        collectionId: collectionId,
        rating: rating
    }).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    });
}

module.exports.sendRatingService = sendRatingService;