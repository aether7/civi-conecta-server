const jwt = require('jsonwebtoken');
const config = require('../config');

class TokenService {
  createToken(user) {
    const expiration = { expiresIn: config.token.expiration.userLogin };
    return jwt.sign({ user }, config.seed.userLogin, expiration);
  }
}

module.exports = TokenService;
