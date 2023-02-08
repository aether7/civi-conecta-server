const mongoose = require('mongoose');
// const initDB = require('./relational');

mongoose.set('strictQuery', false);

module.exports = function(logger) {
  mongoose.connect(process.env.DATABASE_URL, {}, (err) => {
    if (err) {
      logger.error(err);
      throw err;
    }

    logger.info('DB Status: OnLine');
  });

  // initDB();
};
