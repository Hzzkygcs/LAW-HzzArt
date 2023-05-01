
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class UsernameAlreadyExists extends AutomaticallyHandledException{
    constructor(name="", message="") {
        super(message, StatusCodes.UNAUTHORIZED);
        this.name = "UsernameAlreadyExists";
    }
}
module.exports.UserIsBanned = UsernameAlreadyExists;