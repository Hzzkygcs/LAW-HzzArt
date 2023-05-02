
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class CollectionAlreadyReportedException extends AutomaticallyHandledException{
    constructor(collectionId="", message="") {
        if (message === ""){
            message = `Collection ${collectionId} is already reported`;
        }
        super(message, StatusCodes.BAD_REQUEST, {
            collectionId: collectionId
        });
        this.name = "CollectionAlreadyReportedException";
    }
}
module.exports.CollectionAlreadyReportedException = CollectionAlreadyReportedException;