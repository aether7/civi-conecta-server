const config = require('../config');
const jwt = require('jsonwebtoken');
const { errorResponse } = require("../helpers");

const _verifyToken = (isByCookiesOrHeaders) => (seed) => (req, res, next) => {
  const loginToken = req.cookies.token || req.headers.token;
  const token = isByCookiesOrHeaders ? loginToken : req.query.token;

  jwt.verify(token, seed, (err, decoded) => {
    if (err) {
      return res.status(401).json({ ok: false, error: err });
    }

    req.user = decoded.user;
    next();
  });
};

const verifyToken = (req, resp, next, byCookiesOrHeaders, seed) => {
  const { cookies, headers, query } = req;
  const tokenLogin = cookies.token || headers.token;
  const token = byCookiesOrHeaders ? tokenLogin : query.token;

  jwt.verify(token, seed, (error, decoded) => {
    if (error) return errorResponse(resp, 401, error);
    req.user = decoded.user;
    next();
  });
};

const verifyByHeaders = _verifyToken(true);
const verifyByQuery = _verifyToken(false);


const verifyLoginToken = (req, resp, next) =>
  verifyToken(req, resp, next, true, config.seed.userLogin);

const verifyLoginTokenByQuery = (req, resp, next) =>
  verifyToken(req, resp, next, false, config.seed.userLogin);

const verifyRecoveryPasswordToken = (req, resp, next) =>
  verifyToken(req, resp, next, false, config.seed.recoverPassword);

const verifySurveyStudentsToken = (req, resp, next) =>
  verifyToken(req, resp, next, false, config.seed.surveyStudents);

const verifyAutoLoginToken = (req, resp, next) =>
  verifyToken(req, resp, next, false, config.seed.userLogin);

const verifyActiveState = (req, resp, next) => {
  const condition = !req.user.active;
  const message = `This user isn't active`;
  if (condition) return errorResponse(resp, 400, message);
  next();
};

const verifyAdminRole = (req, resp, next) => {
  const condition = req.user.role !== "Administrator";
  const message = `This user isn't Administrator`;
  if (condition) return errorResponse(resp, 400, message);
  next();
};

const verifyUserRole = (req, resp, next) => {
  const condition = req.user.role !== "User";
  const message = `This user isn't a user role`;
  if (condition) return errorResponse(resp, 400, message);
  next();
};

module.exports = {
  verifyLoginToken,
  verifyLoginTokenByQuery,
  verifyRecoveryPasswordToken,
  verifySurveyStudentsToken,
  verifyAutoLoginToken,
  verifyActiveState,
  verifyAdminRole,
  verifyUserRole,
};
