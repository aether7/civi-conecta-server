const { Router } = require('express');
const middlewares = require('../../middlewares/authentication');
const handlers = require('./controller');
const router = Router();

router.get('/', handlers.getAll);
router.get('/type/student', handlers.findByStudentType);
router.get('/:surveyId', handlers.findById);
router.get('/report/:uuid', handlers.getReport);
router.post('/:topicId', middlewares.verifyAdminRole, handlers.saveSurvey);

module.exports = router;
