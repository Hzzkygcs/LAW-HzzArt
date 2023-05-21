const express = require("express");
const {getUsernameFromJWT} = require("../modules/util/account/get-username-from-JWT");
const {getAllCollections,getAllCollectionsWithLikeComments} = require("../modules/util/collections/get-all-collections");
const {checkBanCollections} = require("../modules/util/admin-service/check-ban-collections");
const route = express.Router();

route.get("/", async (req, res) => {
    const jwt = req.get(process.env.JWT_TOKEN_HEADER_NAME);

    await getUsernameFromJWT(jwt);

    let posts = await getAllCollectionsWithLikeComments();

    let allCollections = await getAllCollections(jwt);

    let bannedCollections = await checkBanCollections();

    const updatedCollections = allCollections.collections.filter(collection => !bannedCollections.includes(collection.id));

    const aggregatedData = updatedCollections.map(collection => {
        const { id, name, owner, images } = collection;
        const matchingPost = posts.find(post => post.post_id === id);
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

    const aggregatedDataSorted = aggregatedData.sort((a, b) => {
        if (a.likes !== b.likes) {
            return b.likes - a.likes; // Sort by likes in descending order
        } else {
            return b.comments - a.comments; // Sort by comments in descending order if likes are the same
        }
    });
    console.log(aggregatedDataSorted);
    res.send(aggregatedDataSorted);
});

module.exports.route = route;