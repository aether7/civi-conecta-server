const crypto = require('crypto');

function encrypt(password) {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
}

async function createRandomPassword() {
  const { nanoid } = await import('nanoid');
  return nanoid(10);
}

function compare(encryptedPassword, rawPassword) {
  const processedPassword = encrypt(rawPassword);
  return encryptedPassword === processedPassword;
}

function isValidPassword (user, password) {
  if (!user.encrypted_password) {
    return user.password === password;
  }

  return compare(user.password, password);
}

module.exports = {
  encrypt,
  createRandomPassword,
  compare,
  isValidPassword
};
