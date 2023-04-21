const {getAdminServiceUrl} = require("../URLs/get-admin-service-url");
const axios = require("axios");
async function isUserBanned(username) {
    console.log("Login Service: Checking if user is banned...");
    let response;
    try {
        response = await axios({
            url: getAdminServiceUrl('/admin/check-account/' + username),
            method: 'get'
        })
    } catch (error) {
        let status;
        let errorMessage = "Failed to check user banned status: ";
        if (error.response) {
            status = error.response.status;
            errorMessage = errorMessage + error.response.data;
        } else if (error.request) {
            status = 408;
            errorMessage = errorMessage + "No response from admin service.";
        } else {
            status = 400;
            errorMessage = errorMessage + "Error: " + error.message;
        }
        console.log(status, errorMessage);
        return {status: status, message: errorMessage};
    }

    console.log("User status:\n" + JSON.stringify(response.data));
    return {status: 200, isBan: response.data['isBan']};
}

module.exports.isUserBanned = isUserBanned;