const {getAnyHealthyServiceHostName} = require("../config/consul");

async function getLikeCommentServiceUrl(relativeUrl) {
    let baseUrl = process.env.LIKE_COMMENT_SERVICE_URL;
    baseUrl = await getAnyHealthyServiceHostName(process.env.LIKE_COMMENT_SERVICE_NAME, baseUrl);
    return baseUrl + relativeUrl;
}

module.exports.getLikeCommentServiceUrl = getLikeCommentServiceUrl;