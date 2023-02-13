const crypto = require('crypto');

class PasswordService {
  encrypt(password) {
    return crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
  }

  compare(encryptedPassword, rawPassword) {
    const processedPassword = this.encrypt(rawPassword);
    return encryptedPassword === processedPassword;
  }
}

module.exports = PasswordService;
