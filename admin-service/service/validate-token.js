const {InvalidTokenException } = require("../modules/exceptions/InvalidTokenException");

function validateToken(req) {
    const serviveToken = req.get("x-service-token")
    if (serviveToken !== process.env.ADMIN_SERVICE_TOKEN) {
        throw new InvalidTokenException();
    }
}

module.exports.validateToken = validateToken;