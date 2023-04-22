const {getAdminServiceUrl} = require("../URLs/get-admin-service-url");
const axios = require("axios");
const {NoExternalServiceResponse} = require("../modules/exceptions/NoExternalServiceResponse");
async function isUserBanned(username) {
    console.log("Login Service: Checking if user is banned...");
    let response;
    try {
        response = await axios({
            url: getAdminServiceUrl('/admin/check-account/' + username),
            method: 'get'
        })
    } catch (error) {
        if (error.response) {
            throw error;
        } else if (error.request) {
            // status = 408;
            // errorMessage = errorMessage + "No response from admin service.";
            throw new NoExternalServiceResponse('Admin Management');
        } else {
            // status = 400;
            // errorMessage = errorMessage + "Error: " + error.message;
            throw error;
        }
    }

    console.log("User status:\n" + JSON.stringify(response.data));
    return response.data['isBan'];
}

module.exports.isUserBanned = isUserBanned;