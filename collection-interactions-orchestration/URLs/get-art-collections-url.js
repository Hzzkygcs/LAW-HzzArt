function getArtCollectionsUrl(relativePath){
    const baseUrl = process.env.ART_COLLECTIONS_URL;
    return baseUrl + relativePath;
}

function getArtCollectionsLikeCommentUrl(relativePath){
    const baseUrl = process.env.LIKE_COMMENT_SERVICE_URL;
    return baseUrl + relativePath;
}

module.exports = {getArtCollectionsUrl, getArtCollectionsLikeCommentUrl};