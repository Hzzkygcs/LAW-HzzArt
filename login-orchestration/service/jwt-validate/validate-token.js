const jwt = require("jsonwebtoken");
const {JwtValidationError} = require("./JwtValidationError");

let secretKey = process.env.JWT_SECRET_KEY;
function validateJwtToken(token) {

    return jwt.verify(token, secretKey, function (error, decoded) {
        if (error) {
            throw JwtValidationError.from(error);
        }
        return decoded;
    });

}

module.exports.validateJwtToken = validateJwtToken;