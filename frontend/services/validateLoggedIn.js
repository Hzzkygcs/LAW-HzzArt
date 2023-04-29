const {urls} = require("../core/configuration/urls");

function validateLoggedIn(req, res) {
    const jwtTokenExists = req.cookies['x-jwt-token'] ?? req.get('x-jwt-token');
    if (jwtTokenExists != null)
        return true;
    const temporaryRedirect = 302;
    res.redirect(temporaryRedirect, urls.authentication.login_page());
    return false;
}
module.exports.validateLoggedIn = validateLoggedIn;