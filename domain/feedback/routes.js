const { Router } = require('express');
const handlers = require('./controller');
const router = Router();

router.get('/status/:uuid/detailed', handlers.checkDetailedStatus);
router.get('/status/:uuid', handlers.checkFeedbackStatus);
router.get('/:surveyType/:aliasId', handlers.getFeedback);
router.put('/:surveyType/:aliasId', handlers.finishSurvey);
router.post('/:surveyType/:uuid', handlers.createFeedback);
router.post('/:surveyId/:type/:aliasId', handlers.saveAnswer);

module.exports = router;
