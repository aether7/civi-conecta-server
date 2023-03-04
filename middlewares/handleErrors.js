/* eslint-disable no-unused-vars */
const handleNotFound = (req, res, next) => {
  res.status(404).json({ ok: false, error: 'resource not found' });
};

const handleServerError = (err, req, res, next) => {
  req.logger.error(err.stack);
  res.status(500).json({ ok: false, error: err.message });
};

module.exports = {
  handleNotFound,
  handleServerError
};
