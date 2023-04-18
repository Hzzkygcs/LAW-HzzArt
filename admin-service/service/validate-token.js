const {InvalidTokenException } = require("../modules/exceptions/InvalidTokenException");

function validateToken(req) {
    const serviceToken = req.get("x-service-token")
    if (serviceToken !== process.env.ADMIN_SERVICE_TOKEN) {
        throw new InvalidTokenException();
    }
}

module.exports.validateToken = validateToken;