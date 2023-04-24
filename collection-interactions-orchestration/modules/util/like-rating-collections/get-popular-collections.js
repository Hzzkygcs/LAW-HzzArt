const axios = require('axios');
const {getArtCollectionsUrl} = require('../../../URLs/get-like-rating-service-url');

async function getPopularCollections(search) {
  const url = getArtCollectionsUrl('/get-like-rating-collections');
  response = await axios.get(url, {
    params: {
        search: search
    }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        console.log(error);
    });
    return response;
}

module.exports.getPopularCollections = getPopularCollections;