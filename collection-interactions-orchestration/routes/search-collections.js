const express = require("express");
const {getPopularCollections} = require("../modules/util/like-rating-collections/get-popular-collections");
const {getNameImgCollections} = require("../modules/util/collections/getNameImgCollections");
const {checkBanCollections} = require("../modules/util/admin-service/check-ban-collections");

const route = express.Router();

// end point untuk search suatu collections:
//   - dapetin list popular collections (like-rating-service)
//   - dapetin image url dan nama
//     dari masing-masing collections tersebut (servicenya pram)
//   - cek apakah collections2 tersebut ada
//     yang udah diban atau belum (admin-management)
route.get("/:search", async (req, res) => {
    const search = req.params.search;
    const collections = getPopularCollections(search);
    const imgName = getNameImgCollections(collections);
    const checkBan = checkBanCollections(collections);
    //get image url and name from each collections
    //check if collections are banned or not
    const result = collections.map((collection) => {
        return {
            collectionId: collection.collectionId,
            imageUrl: collection.imageUrl,
            name: collection.name,
            isBanned: collection.isBanned,
        };
    });
    res.send(result);
});

module.exports.route = route;