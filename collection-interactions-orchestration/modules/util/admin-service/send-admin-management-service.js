import {request} from "express";

function sendAdminManagementService(username, collectionId, reason) {
    const url = process.env.ADMIN_MANAGEMENT_SERVICE_URL;
    const options = {
        method: "POST",
        uri: url,
        body: {
            username: username,
            collectionId: collectionId,
            reason: reason
        },
        json: true
    };

    request(options, (error, response, body) => {
        if (error) {
            console.log(error);
        }
        console.log(body);
    });
}

module.exports.sendAdminManagementService = sendAdminManagementService;