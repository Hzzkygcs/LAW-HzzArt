const path = require("path");
const fs = require('fs');


module.exports.clearFolder = function (folderName="temp") {
    const tempFolderPath = path.join(process.cwd(), folderName);

    try{
        fs.rmSync(tempFolderPath, { recursive: true, force: true });
    }catch (e){}
    try{
        fs.mkdirSync(tempFolderPath);
    }catch (e){}

}