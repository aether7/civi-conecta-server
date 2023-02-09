const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

module.exports = function(databaseURL, logger) {
  mongoose.connect(databaseURL, {}, (err) => {
    if (err) {
      logger.error(err);
      throw err;
    }

    logger.info('DB Status: OnLine');
  });
};
