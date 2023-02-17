const crypto = require('crypto');

class PasswordService {
  encrypt(password) {
    return crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
  }

  async createRandomPassword() {
    const { nanoid } = await import('nanoid');
    return nanoid(10);
  }

  compare(encryptedPassword, rawPassword) {
    const processedPassword = this.encrypt(rawPassword);
    return encryptedPassword === processedPassword;
  }
}

module.exports = PasswordService;
