const express = require("express");
const {getCollections} = require("../modules/util/like-rating-collections/get-collections");
const {checkBanCollections} = require("../modules/util/admin-service/check-ban-collections");
const {getAllCollectionsWithLikeComments} = require("../modules/util/collections/get-all-collections");
const {checkBanAccounts} = require("../modules/util/admin-service/check-ban-account");
const {getUsernameFromJWT} = require("../modules/util/account/get-username-from-JWT");

const route = express.Router();

route.post("/", async (req, res) => {
    const jwt = req.get(process.env.JWT_TOKEN_HEADER_NAME);

    await getUsernameFromJWT(jwt);
    let posts = await getAllCollectionsWithLikeComments();
    let searchCollections = await getCollections(req.body.search, jwt);
    console.log("searchCollections");
    console.log(searchCollections);

    let bannedCollections = await checkBanCollections();
    let bannedAccounts = await checkBanAccounts();

    let updatedCollections = searchCollections.collections.filter(collection => !bannedCollections.includes(collection.id));
    updatedCollections = updatedCollections.filter(account => !bannedAccounts.includes(account.owner));

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
    console.log("aggregatedData");
    console.log(aggregatedData);
    res.send(aggregatedData);
});

module.exports.route = route;