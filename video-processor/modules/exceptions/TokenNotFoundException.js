
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class TokenNotFoundException extends AutomaticallyHandledException{
    constructor(tokenName) {
        super("Token not found", StatusCodes.BAD_REQUEST, {
            token: tokenName
        });
        this.name = "TokenNotFoundException";
    }
}
module.exports.TokenNotFoundException = TokenNotFoundException;
