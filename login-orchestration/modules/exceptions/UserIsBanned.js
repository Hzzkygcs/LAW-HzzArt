const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class UserIsBanned extends AutomaticallyHandledException{
    constructor(username="", message="") {
        if (message === ""){
            message = `User ${username} is banned.`
        }
        super(message, StatusCodes.UNAUTHORIZED);
        this.name = "UserIsBanned";
    }
}
module.exports.UserIsBanned = UserIsBanned;