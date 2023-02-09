const express = require('express');
const handlers = require('../controllers/auth');
const router = express.Router();

router.post('/signIn', handlers.signIn);
router.get('/signOut', handlers.signOut);

module.exports = router;
