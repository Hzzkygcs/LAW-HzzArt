require("express-async-errors");
const {app} = require("./main-setup.js");
const {getConsulSingleton} = require("./config/consul");

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (err) => {
    console.error('Uncaught promise exception:', err);
});


const PORT = 8080;
return app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    getConsulSingleton(PORT, process.env.FRONTEND_SERVICE_NAME);
});