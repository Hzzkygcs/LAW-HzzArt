const express = require("express");
const {viewDirectories} = require("./core/configuration/viewDirectories");
const {defaultRoute} = require("./routes/default");
const {homepageRoute} = require("./routes/homepage");
const cookieParser = require("cookie-parser");
const {adminRoute} = require("./routes/admin");

const app = express();

app.set('views', viewDirectories);
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

app.disable('view cache');
app.use(cookieParser());



app.use(adminRoute);
app.use(homepageRoute);
app.use(defaultRoute);


module.exports.app = app;