const express = require("express");
const {getUsernameFromJWT} = require("../modules/util/account/get-username-from-JWT");
const {getAllCollections,getAllCollectionsWithLikeComments} = require("../modules/util/collections/get-all-collections");
const route = express.Router();

route.get("/", async (req, res) => {
    const jwt = req.get(process.env.JWT_TOKEN_HEADER_NAME);

    await getUsernameFromJWT(jwt);

    let posts = await getAllCollectionsWithLikeComments();

    let collections = await getAllCollections(jwt);

    const aggregatedData = collections.collections.map(collection => {
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

    console.log(aggregatedData);
    res.send(aggregatedData);
});

module.exports.route = route;