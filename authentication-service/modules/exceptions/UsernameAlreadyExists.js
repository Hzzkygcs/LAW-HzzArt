
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class UsernameAlreadyExists extends AutomaticallyHandledException{
    constructor(username="") {
        super(`Username ${username} already exists`, StatusCodes.UNAUTHORIZED, {
            username: username
        });
        this.name = "UsernameAlreadyExists";
    }
}
module.exports.UsernameAlreadyExists = UsernameAlreadyExists;