
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class UnequalLastPasswordUpdateDate extends AutomaticallyHandledException{
    constructor(name="", message="") {
        super(message, StatusCodes.OK);
        this.name = "UnequalLastPasswordUpdateDate";
    }
}
module.exports.UnequalLastPasswordUpdateDate = UnequalLastPasswordUpdateDate;