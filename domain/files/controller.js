const { tryCatch } = require('../../helpers/controller');

const uploadEventFile = async (req, res) => {
  console.log('req files', req.files);
  res.json({ ok: true });
};

module.exports = {
  uploadEventFile: tryCatch(uploadEventFile)
};
