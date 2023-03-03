const { Router } = require('express');
const handlers = require('./controller');
const router = Router();

router.get('/:surveyType/:aliasId', handlers.getFeedback);

module.exports = router;
