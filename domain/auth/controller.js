const config = require('../../config');
const messages = require('../../config/messages');
const repositories = require('../../repositories');
const services = require('../../services');
const templates = require('../../constants/EmailTemplates');
const dto = require('./dto');

const isValidPassword = (user, password) => {
  if (!user.encrypted_password) {
    return user.password === password;
  }

  return services.password.compare(user.password, password);
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await repositories.user.findOneByEmail(email);
    const isValidUser = user && isValidPassword(user, password);

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
  } catch (err) {
    res.status(404).json({ ok: false, error: err.message });
  }
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
    const html = templates.recoverPassword(user.name, nanoid(10));
    await services.email.send({ from, to, subject, html });
    res.json({ ok: true, message: messages.auth.recoverPassword });
  } catch(err) {
    res.status(404).json({ ok: false, error: err.message });
  }
};

const signUpAdmin = async (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  try {
    const newUser = await repositories.user.createAdmin({ email, name, password });
    res.json({ ok: true, user: dto.mapUser(newUser) });
  } catch(err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

const signUpUser = async (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  try {
    const newUser = await repositories.user.createUser({ email, name, password });
    res.json({ ok: true, user: dto.mapUser(newUser) });
  } catch(err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

module.exports = {
  signIn,
  signOut,
  sendRecoverPassword,
  signUpAdmin,
  signUpUser
};
