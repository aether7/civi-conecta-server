const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const messages = require('../config/messages');
const repositories = require('../repositories');
const services = require('../services');
const templates = require('../constants/EmailTemplates');


const isValidPassword = (user, password) =>
  user.encryptedPassword
    ? bcrypt.compareSync(password, user.password)
    : password === user.password;

const getMinimalUserData = ({ email, name, role, active }) => ({
  email,
  name,
  role,
  active,
});

const signIn = async (req, res) => {
  console.log('estamos pasando por aqui ???')
  const { email, password } = req.body;
  const user = await repositories.user.findOneByEmail(email);
  const isValidUser = user && isValidPassword(user, password);

  if (!isValidUser) {
    return res.status(400).json({
      ok: false,
      error: messages.auth.notValid
    });
  }

  const pathSurvey = 'workplaces.courses.letters.surveys.survey';
  const selectSurvey = '-_id -__v';
  const popTop = { path: 'topic' };
  const popSurvey = { path: pathSurvey, select: selectSurvey, populate: popTop };
  const popUser = await user.populate(popSurvey);
  const workplaces = await services.workplace.getWorkPlaces(popUser._doc.workplaces);
  const newUser = services.workplace.getUserWithWorkplaces(popUser, workplaces);

  const expiration = { expiresIn: config.token.expiration.userLogin };
  const userToken = { user: getMinimalUserData(newUser) };
  const token = jwt.sign(userToken, config.seed.userLogin, expiration);
  newUser.token = token;

  res.cookie('token', token);
  res.json({ ok: true, user: newUser });
};

const signOut = (_, res) => {
  res.clearCookie('token');
  res.json({ ok: true, message: messages.auth.logout });
};

const sendRecoverPassword = async (req, res) => {
  try {
    const user = await repositories.user.findOneByEmail(req.body.email);
    const { nanoid } = await import('nanoid');

    const from = config.email.template.name.recoveryPassword;
    const to = req.body.email;
    const subject = config.email.template.subject.recoveryPassword;
    const html = templates.recoverPassword(user.name, nanoid(15));
    await services.email.send({ from, to, subject, html });
    res.json({ ok: true, message: messages.auth.recoverPassword });
  } catch(err) {
    res.status(404).json({ ok: false, error: err.message });
  }
};

module.exports = { signIn, signOut, sendRecoverPassword };
