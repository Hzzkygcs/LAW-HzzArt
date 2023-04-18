const express = require("express");
const {config} = require("./config/config");

const app = express();
config(app);

module.exports = app;

