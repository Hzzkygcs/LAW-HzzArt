require("express-async-errors");
const express = require("express");
const {config} = require("./config/config");

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (err) => {
    console.error('Uncaught promise exception:', err);
});

const tmp = require('tmp');
const {clearFolder} = require("./services/clear-temp-folder");
tmp.setGracefulCleanup();

const app = express();
config(app);
clearFolder("temp");
clearFolder("uploads");

module.exports = app;

