const path = require("path");


module.exports.getTokenName = function (tokenPath) {
    return path.basename(tokenPath);
}