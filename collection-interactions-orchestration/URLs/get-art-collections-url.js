function getArtCollectionsUrl(relativePath){
    const baseUrl = process.env.ART_COLLECTIONS_URL;
    return baseUrl + relativePath;
}

module.exports.getArtCollectionsUrl = getArtCollectionsUrl;