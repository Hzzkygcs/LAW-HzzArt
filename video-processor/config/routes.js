const {submitVideoRoute} = require("../routes/submit-video");
const {checkStatusRoute} = require("../routes/check-status");


module.exports.define_routes = function (app) {
    app.use('/', submitVideoRoute);
    app.use('/', checkStatusRoute);
}