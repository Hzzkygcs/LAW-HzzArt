const {submitVideoRoute} = require("../routes/submit-video");
const {checkStatusRoute} = require("../routes/check-status");
const {downloadRoute} = require("../routes/download");
const {consulHealthRoute} = require("../routes/consul");


module.exports.define_routes = function (app) {
    app.use('/', submitVideoRoute);
    app.use('/', checkStatusRoute);
    app.use('/', downloadRoute);
    app.use('/', consulHealthRoute);
}