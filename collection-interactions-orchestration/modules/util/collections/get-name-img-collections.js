const axios = require('axios');
const {getArtCollectionsUrl} = require('../../../URLs/get-art-collections-url');

async function getNameImgCollections(collections) {
    const url = getArtCollectionsUrl('/get-name-img-collections');
    const response = await axios.get(url, {
        params: {
            collections: collections
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        console.log(error);
    });
    return response;
}

module.exports.getNameImgCollections = getNameImgCollections;