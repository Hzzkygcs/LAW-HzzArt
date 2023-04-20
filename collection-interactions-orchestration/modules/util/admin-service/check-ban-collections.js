const axios = require('axios');
const {getAdminManagerUrl} = require('../../../URLs/get-admin-manager-url');

async function checkBanCollections(collections) {
    const url = getAdminManagerUrl('/admin/check-collection');
    axios.get(url, {
        params: {
            collections: collections
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        console.log(error);
    });
}

module.exports.checkBanCollections = checkBanCollections;