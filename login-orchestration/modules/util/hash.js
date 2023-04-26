const bcrypt = require('bcrypt');

async function hashValue(value) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(value, salt);
}
module.exports.hashValue = hashValue;