const errorResponse = (res, status, error) => {
  res.status(status).json({ ok: false, error });
};

module.exports = { errorResponse };
