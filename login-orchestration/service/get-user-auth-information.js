const {getAuthenticationServiceUrl} = require("../URLs/get-authentication-service-url");
const axios = require("axios");
const {NoExternalServiceResponse} = require("../modules/exceptions/NoExternalServiceResponse");
const {ServiceResponseException} = require("../modules/exceptions/ServiceResponseException");
async function getUserAuthInformation(username, password) {
    console.log("Login Service: fetching user...");
    let currentService = "Authentication Service";
    let getUserResponse;
    try {
        getUserResponse = await axios({
            url: await getAuthenticationServiceUrl('/auth/validate-login'),
            method: 'post',
            data: {
                username: username,
                password: password
            }
        });
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
            throw new ServiceResponseException(currentService, error.response.status, error.response.data);
        } else if (error.request) {
            console.log(error.request);
            throw new NoExternalServiceResponse("Authentication");
        } else {
            console.log('Error:', error.message);
            throw error;
        }
    }

    console.log(getUserResponse.data);
    return getUserResponse.data;
}

module.exports.getUserAuthInformation = getUserAuthInformation;