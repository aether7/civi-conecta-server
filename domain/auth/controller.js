const config = require('../../config');
const messages = require('../../config/messages');
const repositories = require('../../repositories');
const passwordHelper = require('../../helpers/password');
const services = require('../../services');
const templates = require('../../constants/EmailTemplates');
const { wrapRequests } = require('../../helpers/controller');
const dto = require('./dto');


const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await repositories.user.findOneByEmail(email);
  const isValidUser = user && passwordHelper.isValidPassword(user, password);

  if (!isValidUser) {
    return res.status(400).json({
      ok: false,
      error: messages.auth.notValid
    });
  }

  const loggedUser = dto.mapUser(user);
  const token = services.token.createToken(loggedUser);
  loggedUser.token = token;

  res.cookie('token', token);
  res.json({ ok: true, user: loggedUser });
};

const signOut = (_, res) => {
  res.clearCookie('token');
  res.json({ ok: true, message: messages.auth.logout });
};

const sendRecoverPassword = async (req, res) => {
  const user = await repositories.user.findOneByEmail(req.body.email);
  const { nanoid } = await import('nanoid');
  const newPassword = nanoid(10);
  await repositories.user.updatePassword(user.id, newPassword);

  const from = config.email.template.name.recoveryPassword;
  const to = req.body.email;
  const subject = config.email.template.subject.recoveryPassword;
  const html = templates.recoverPassword(user.name, newPassword);
  await services.email.send({ from, to, subject, html });
  res.json({ ok: true, message: messages.auth.recoverPassword });
};

const signUpAdmin = async (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  const newUser = await repositories.user.createAdmin({ email, name, password });
  res.json({ ok: true, user: dto.mapUser(newUser) });
};

const signUpUser = async (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  const newUser = await repositories.user.createUser({ email, name, password });
  res.json({ ok: true, user: dto.mapUser(newUser) });
};

const verifyStudent = async (req, res) => {
  const run = req.body.run;
  const student = await repositories.student.findByRun(run);

  if (!student) {
    return res.status(404).json({ ok: false, error: messages.auth.noStudent });
  }

  res.json({ ok: true, student });
};

module.exports = wrapRequests({
  signIn,
  signOut,
  sendRecoverPassword,
  signUpAdmin,
  signUpUser,
  verifyStudent
});
