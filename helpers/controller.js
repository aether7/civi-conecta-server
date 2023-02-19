const tryCatch = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    if (err.isCustomException) {
      return res.status(400).json({ ok: false, error: err.message });
    }

    throw err;
  }
};

module.exports = { tryCatch };
