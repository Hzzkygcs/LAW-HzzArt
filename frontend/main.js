const {app} = require("./main-setup.js");
const {getConsulSingleton} = require("./config/consul");


const PORT = 8080;
return app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    getConsulSingleton(PORT, process.env.FRONTEND_SERVICE_NAME);
});