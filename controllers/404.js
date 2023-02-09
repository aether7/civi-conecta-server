const { errorResponse } = require('../helpers/http');

const get404 = (_, res) => errorResponse(res, 404, 'Page not found');

module.exports = { get404 };
