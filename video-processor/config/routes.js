const {submit_video_route} = require("../routes/submit-video");


module.exports.define_routes = function (app) {
    app.use('/', submit_video_route);
}