const axios = require('axios');
const {getArtCollectionsUrl} = require('../../../URLs/get-art-collections-url');

async function getNameImgCollections(collections) {
    const url = getArtCollectionsUrl('/get-name-img-collections');
    axios.get(url, {
        params: {
            collections: collections
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        console.log(error);
    });
}

module.exports.getNameImgCollections = getNameImgCollections;