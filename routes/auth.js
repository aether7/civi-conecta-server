const express = require('express');
const handlers = require('../domain/auth/controller');
const router = express.Router();

router.post('/signIn', handlers.signIn);
router.get('/signOut', handlers.signOut);
router.post('/password', handlers.sendRecoverPassword);


module.exports = router;
