const {getAnyHealthyServiceHostName} = require("../config/consul");
module.exports.loginOrchestration = async () => {
    let ret = "http://login-orchestration:8085";
    ret = getAnyHealthyServiceHostName(process.env.LOGIN_ORCHESTRATION_NAME, ret);
    return ret;
};