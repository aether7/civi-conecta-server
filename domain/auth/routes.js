const express = require('express');
const handlers = require('./controller');
const middlewares = require('../../middlewares/authentication');
const router = express.Router();

router.post('/signIn', handlers.signIn);
router.get('/signOut', handlers.signOut);
router.post('/password', handlers.sendRecoverPassword);
router.post('/student', handlers.verifyStudent);


const middlewareCreation = [
  middlewares.verifyLoginToken,
  middlewares.verifyActiveState,
  middlewares.verifyAdminRole
];

router.post('/signup/admin', middlewareCreation, handlers.signUpAdmin);
router.post('/signup/user', middlewareCreation, handlers.signUpUser);

module.exports = router;
