const express = require('express');
const handlers = require('./controller');
const router = express.Router();

router.get('/', handlers.getGrades);
router.get('/letters', handlers.getLetters);

module.exports = router;
