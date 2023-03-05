const { Router } = require('express');
const handlers = require('./controller');
const router = Router();

router.get('/status/:uuid', handlers.checkFeedbackStatus);
router.post('/:surveyType/:uuid', handlers.createFeedback);
router.get('/:surveyType/:aliasId', handlers.getFeedback);
router.post('/:surveyId/:type/:aliasId', handlers.saveAnswer);

module.exports = router;
