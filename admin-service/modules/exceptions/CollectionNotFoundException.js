
const {StatusCodes} = require("http-status-codes");
const {AutomaticallyHandledException} = require("../global-route-exceptions-handler/exceptions/AutomaticallyHandledException");


class CollectionNotFoundException extends AutomaticallyHandledException{
    constructor(collectionId="", message="") {
        if (message === ""){
            message = `Collection ${collectionId} is not found`;
        }
        super(message, StatusCodes.NOT_FOUND, {
            collectionId: collectionId
        });
        this.name = "CollectionNotFoundException";
    }
}

module.exports.CollectionNotFoundException = CollectionNotFoundException;