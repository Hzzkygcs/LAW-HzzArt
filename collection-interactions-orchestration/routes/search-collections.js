const express = require("express");
const {getPopularCollections} = require("../modules/util/like-rating-collections/get-popular-collections");
const {getNameImgCollections} = require("../modules/util/collections/getNameImgCollections");
const {checkBanCollections} = require("../modules/util/admin-service/check-ban-collections");

const route = express.Router();

route.get("/:search", async (req, res) => {
    const combined = {};
    const search = req.params.search;
    const collections = getPopularCollections(search);

    const nameImgCollections = getNameImgCollections(collections);

    const checkCollection = checkBanCollections(collections);

    nameImgCollections.forEach((collection) => {
        const matchingCollections = checkCollection.filter(
          (check) => check.collectionId === collection.collectionId && check.isBan === false
        );
        if (matchingCollections.length > 0) {
          combined[collection.collectionId] = {
            collectionName: collection.collectionName,
            imageUrls: collection.imageUrls,
          };
        }
    });
    res.json(combined);
});

module.exports.route = route;