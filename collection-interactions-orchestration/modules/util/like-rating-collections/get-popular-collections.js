const axios = require('axios');
const {getArtCollectionsUrl} = require('../../../URLs/get-like-rating-service-url');

async function getPopularCollections(search) {
  const url = getArtCollectionsUrl('/get-like-rating-collections');

  axios.get(url, {
    params: {
        search: search
    }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        console.log(error);
    });
}

module.exports.getPopularCollections = getPopularCollections;