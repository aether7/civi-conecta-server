module.exports = (req, res, next) => {
  req.logger.info('Request to %s', req.originalUrl);
  next();
};
