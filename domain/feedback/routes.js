const { Router } = require('express');
const handlers = require('./controller');
const router = Router();

router.get('/status/:uuid/detailed', handlers.checkDetailedStatus);
router.get('/status/:uuid', handlers.checkFeedbackStatus);
router.get('/student/:rut/status', handlers.checkSurveyStatus);
router.get('/:surveyType/:aliasId', handlers.getFeedback);
router.put('/:surveyType/:aliasId', handlers.finishSurvey);
router.post('/:surveyId/:type/:aliasId', handlers.saveAnswer);
router.put('/:uuid', handlers.finishAllSurveys);

module.exports = router;
