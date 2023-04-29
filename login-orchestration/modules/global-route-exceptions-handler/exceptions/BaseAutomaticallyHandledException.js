class BaseAutomaticallyHandledException extends Error{
    constructor(message) {
        super(message);
    }
}
module.exports.BaseAutomaticallyHandledException = BaseAutomaticallyHandledException;