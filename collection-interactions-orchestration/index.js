const {collectionInteractionOrchestration} = require("./main");

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (err) => {
    console.error('Uncaught promise exception:', err);
});


collectionInteractionOrchestration(false)