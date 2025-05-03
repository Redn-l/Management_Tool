const bcrypt = require("bcryptjs");

const salts = 10;

const getHashPassword = async (password) => {
    return  await bcrypt.hash(password, salts);
};

const comparePasswords = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword);
};

module.exports = {
    getHashPassword,
    comparePasswords
};