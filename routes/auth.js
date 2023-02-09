const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const repositories = require('../repositories');
const WorkplaceService = require('../services/WorkplaceService');
const router = express.Router();

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

const workplaceService = new WorkplaceService();

router.post('/signIn', async (req, res) => {
  const { email, password } = req.body;
  const user = await repositories.user.findOneByEmail(email);
  const isValidUser = user && isValidPassword(user, password);

  if (!isValidUser) {
    return res.status(400).json({
      ok: false,
      error: 'El correo y/o clave son incorrectas'
    });
  }

  const pathSurvey = 'workplaces.courses.letters.surveys.survey';
  const selectSurvey = '-_id -__v';
  const popTop = { path: 'topic' };
  const popSurvey = { path: pathSurvey, select: selectSurvey, populate: popTop };
  const popUser = await user.populate(popSurvey);
  const workplaces = await workplaceService.getWorkPlaces(popUser._doc.workplaces);
  const newUser = workplaceService.getUserWithWorkplaces(popUser, workplaces);

  const expiration = { expiresIn: config.token.expiration.userLogin };
  const userToken = { user: getMinimalUserData(newUser) };
  const token = jwt.sign(userToken, config.seed.userLogin, expiration);
  newUser.token = token;

  res.cookie('token', token);
  res.json({ ok: true, user: newUser });
});

router.get('/signOut', (_, res) => {
  res.clearCookie('token');
  res.json({ ok: true, message: 'Sign out successful' });
});

module.exports = router;
