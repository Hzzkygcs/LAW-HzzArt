
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class UsernameNotFoundException extends AutomaticallyHandledException{
    constructor(name="", message="") {
        super(message, StatusCodes.NOTFOUND);
        this.name = "UsernameNotFoundException";
    }
}
module.exports.UsernameNotFoundException = UsernameNotFoundException;