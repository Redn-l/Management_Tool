const jwt = require('jsonwebtoken');

const SECRET_KEY = "nsdjsbdjshdjsh7627632nbsnsdhsgd!!kwjhwjkw";

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: 60 * 60
  });
};

const verifyToken = (token, cb) => {
  jwt.verify(token, SECRET_KEY, cb);
};

module.exports = { generateToken, verifyToken };