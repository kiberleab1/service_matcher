const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}
module.exports.hashPassword = hashPassword;


async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
}

module.exports.comparePassword = comparePassword;