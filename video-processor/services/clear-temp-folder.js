const path = require("path");
const fs = require('fs');


module.exports.clearTempFolder = function () {
    const tempFolderPath = path.join(process.cwd(), "temp");

    try{
        fs.rmSync(tempFolderPath, { recursive: true, force: true });
    }catch (e){}
    try{
        fs.mkdirSync(tempFolderPath);
    }catch (e){}

}