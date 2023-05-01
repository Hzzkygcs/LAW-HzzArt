const {rootFolderPath} = require("./rootFolderPath");
const Path = require("path");


const viewDirectories = [
    Path.join(rootFolderPath, 'templates'),
];

module.exports.viewDirectories = viewDirectories;