const path = require('path');
const {getInstanceNumberId} = require("./consul");


module.exports.defaultTmpOptions = function () {
    // const relativePath = path.relative(path1, path2);

    return {
        tmpdir: path.join(process.cwd(), 'temp'),
        prefix: `instance-${getInstanceNumberId()}-token`
    };
}