
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class TokenNotFoundException extends AutomaticallyHandledException{
    constructor(tokenName) {
        super("Token not found", StatusCodes.NOT_FOUND, {
            token: tokenName
        });
        this.name = "TokenNotFoundException";
    }
}
module.exports.TokenNotFoundException = TokenNotFoundException;
