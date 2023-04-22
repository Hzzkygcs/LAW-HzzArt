const {getAuthenticationServiceUrl} = require("../URLs/get-authentication-service-url");
const axios = require("axios");
const {NoExternalServiceResponse} = require("../modules/exceptions/NoExternalServiceResponse");
async function getUser(username, password) {
    console.log("Login Service: fetching user...");
    let getUserResponse;
    try {
        getUserResponse = await axios({
            url: getAuthenticationServiceUrl('/auth/validate-login'),
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
            throw new Error(error);
            // res.status(error.response.status).send(error.response.data);
        } else if (error.request) {
            console.log(error.request);
            throw new NoExternalServiceResponse("Authentication");
            // res.status(408).send("No response from authentication service.");
        } else {
            console.log('Error:', error.message);
            throw new Error(error);
        }
    }

    console.log(getUserResponse.data);
    return getUserResponse.data;
}

module.exports.getUser = getUser;