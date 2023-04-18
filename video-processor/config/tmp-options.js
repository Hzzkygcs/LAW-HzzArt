const path = require('path');


module.exports.defaultTmpOptions = function () {
    // const relativePath = path.relative(path1, path2);

    return {
        tmpdir: path.join(process.cwd(), 'temp'),
        prefix: "token"
    };
}