function getLikeRatingServiceUrl(relativeUrl) {
    const baseUrl = process.env.LIKE_RATING_SERVICE_URL;
    return baseUrl + relativeUrl;
}

module.exports.getLikeRatingServiceUrl = getLikeRatingServiceUrl;