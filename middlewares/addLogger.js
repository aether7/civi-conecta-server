module.exports = (logger) => (req, res, next) => {
  req.logger = logger;
  next();
};
