const { Router } = require('express');
const middlewares = require('../middlewares/authentication');
const handlers = require('../domain/survey/controller');
const router = Router();

router.get('/', handlers.getAll);
router.get('/:surveyId', handlers.findById);
router.post('/', middlewares.verifyAdminRole, handlers.createSurvey);

module.exports = router;
