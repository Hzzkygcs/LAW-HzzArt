const {urls} = require("../core/configuration/urls");
const axios = require("axios");
const {HttpStatusCode} = require("axios");
const {loginOrchestration} = require("./loginOrchestration");

async function validateLoggedIn(req, res) {
    const jwtToken = req.cookies['x-jwt-token'] ?? req.get('x-jwt-token');
    console.log(jwtToken);
    if (jwtToken != null) {
        return await validateJwtToLoginOrchestration(res, jwtToken);
    }
    const temporaryRedirect = 302;
    res.redirect(temporaryRedirect, urls.authentication.login_page());
    return false;
}
module.exports.validateLoggedIn = validateLoggedIn;

async function validateJwtToLoginOrchestration(res, jwtToken) {
    const url = `${loginOrchestration()}/login/validate-login`;
    console.log(url);
    try{
        return await axios({
            url: url,
            method: "post",
            data: {
                "x-jwt-token": jwtToken,
            }
        });
    }catch (e) {
        console.log(e);
        const reloginUrl = "/authentication/login.html";
        res.send(HttpStatusCode.Unauthorized, `Invalid token. Please <a href="${reloginUrl}">relogin</a>`);
    }
}