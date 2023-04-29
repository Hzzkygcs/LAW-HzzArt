const axios = require("axios");
const {REASON_RESPONSE_PROPERTY_NAME} = require("../global-route-exceptions-handler/constants");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");

module.exports.makeRequest = async function(method, url, data){
    let response;
    try{
        response = await axios({
            url: url,
            method: method,
            data: data
        });
    }catch (e){
        const response = e.response;
        if (!response)
            throw e;

        const onlyHasOneKey = Object.keys(response.data).length === 1;
        const thatKeyIsReason  = response.data[REASON_RESPONSE_PROPERTY_NAME] != null
        const comesFromAutomaticallyHandledExceptionFromTheService = onlyHasOneKey && thatKeyIsReason;

        if (comesFromAutomaticallyHandledExceptionFromTheService) {
            throw AutomaticallyHandledException.fromResponse(response.status, response.data);
       }
        throw e;
    }
    return response;
}