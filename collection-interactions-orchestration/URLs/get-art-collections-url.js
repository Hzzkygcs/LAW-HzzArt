const {getAnyHealthyServiceHostName} = require("../config/consul");

async function getArtCollectionsUrl(relativePath){
    let baseUrl = (process.env.INSIDE_DOCKER_CONTAINER != null)?
        process.env.ART_COLLECTIONS_URL : `http://127.0.0.1:${process.env.ART_COLLECTIONS_PORT}`;
    baseUrl = await getAnyHealthyServiceHostName(process.env.ART_COLLECTIONS_NAME, baseUrl);
    return baseUrl + relativePath;
}

async function getArtCollectionsLikeCommentUrl(relativePath){
    let baseUrl = process.env.LIKE_COMMENT_SERVICE_URL;
    baseUrl = await getAnyHealthyServiceHostName(process.env.LIKE_COMMENT_SERVICE_NAME, baseUrl);
    return baseUrl + relativePath;
}

module.exports.getArtCollectionsUrl = getArtCollectionsUrl;
module.exports.getArtCollectionsLikeCommentUrl = getArtCollectionsLikeCommentUrl;