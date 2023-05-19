
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class UserIsNotAdminException extends AutomaticallyHandledException{
    constructor(username="", message="") {
        if (message === ""){
            message = `User ${username} is not admin.`
        }
        super(message, StatusCodes.UNAUTHORIZED);
        this.name = "UserIsNotAdminException";
    }
}

module.exports.UserIsNotAdminException = UserIsNotAdminException;