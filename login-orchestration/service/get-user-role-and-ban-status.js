const {getAdminServiceUrl} = require("../URLs/get-admin-service-url");
const axios = require("axios");
const {NoExternalServiceResponse} = require("../modules/exceptions/NoExternalServiceResponse");
const {ServiceResponseException} = require("../modules/exceptions/ServiceResponseException");
async function getUserRoleAndBanStatus(username) {
    console.log("Login Service: Checking if user is banned...");
    let response;
    let currentService = 'Admin Management Service';
    try {
        response = await axios({
            url: getAdminServiceUrl('/admin/check-account/' + username),
            method: 'get'
        })
    } catch (error) {
        if (error.response) {
            throw new ServiceResponseException(currentService, error.response.status, error.response.data);
        } else if (error.request) {
            throw new NoExternalServiceResponse('Admin Management');
        } else {
            console.log('Error:', error.message);
            throw error;
        }
    }

    console.log("User status:\n" + JSON.stringify(response.data));
    return {
        banned: response.data['isBan'],
        admin: response.data['isAdmin'],
    };
}

module.exports.getUserRoleAndBanStatus = getUserRoleAndBanStatus;