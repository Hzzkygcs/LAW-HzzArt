
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class UsernameNotFoundException extends AutomaticallyHandledException{
    constructor(username="", message="") {
        if (message === ""){
            message = `Username ${username} is not found`;
        }
        super(message, StatusCodes.NOT_FOUND, {
            username: username
        });
        this.name = "UsernameNotFoundException";
    }
}
module.exports.UsernameNotFoundException = UsernameNotFoundException;