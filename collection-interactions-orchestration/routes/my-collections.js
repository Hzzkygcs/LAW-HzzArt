const express = require("express");
const {getUsernameFromJWT} = require("../modules/util/account/get-username-from-JWT");
const {getCurrentUserCollections,getCurrentUserCollectionsWithLikeComments} = require("../modules/util/collections/get-all-collections");
const {checkBanCollections} = require("../modules/util/admin-service/check-ban-collections");
const route = express.Router();

// getMyCollectionsUrl /collections pram
// likeCommentInformations /like-comment/get-posts/ padil

route.get("/", async (req, res) => {
    const jwt = req.get(process.env.JWT_TOKEN_HEADER_NAME);

    await getUsernameFromJWT(jwt);

    let userCollection = await getCurrentUserCollections(jwt);
    let bannedCollections = await checkBanCollections();

    let collectionsId = userCollection.collections.map(collection => collection.id);
    const likeCommentInformations = await getCurrentUserCollectionsWithLikeComments(collectionsId,jwt);
    let updatedCollections = userCollection.collections.filter(collection => !bannedCollections.includes(collection.id));

    const aggregatedData = updatedCollections.map(collection => {
        const { id, name, owner, images } = collection;
        const matchingPost = likeCommentInformations.find(post => post.post_id === id);
        const likes = matchingPost ? matchingPost.post_likes : 0;
        const comments = matchingPost ? matchingPost.post_comments : 0;

        return {
            id,
            name,
            owner,
            images,
            likes,
            comments
        };
    });

    res.send(aggregatedData);
});

module.exports.route = route;
