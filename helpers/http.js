const errorResponse = (res, status, error) => {
  res.status(status).json({ ok: false, error });
};

const getBaseURL = (req) => {
  const { headers, protocol } = req;
  const { host } = headers;
  return `${protocol}://${host}`;
};

module.exports = { errorResponse, getBaseURL };
