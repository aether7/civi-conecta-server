const Users = require('../models/users');

class UserRepository {
  findOneByEmail(email) {
    return new Promise((resolve, reject) => {
      Users.findOne({ email, active: true }, (error, user) => {
        if (error) {
          return reject(error);
        }

        resolve(user);
      });
    });
  }
}

module.exports = UserRepository;
