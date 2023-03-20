const jwt = require('jsonwebtoken');
const config = require('../config');

class TokenService {
  createToken({ uuid, name }) {
    const expiration = { expiresIn: config.token.expiration.userLogin };
    return jwt.sign({ uuid, name }, config.seed.userLogin, expiration);
  }
}

module.exports = TokenService;
