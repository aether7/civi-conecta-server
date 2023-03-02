const { Router } = require('express');
const handlers = require('./controller');
const middlewares = require('../../middlewares/authentication');
const router = Router();

router.get('/type/:surveyType', handlers.getTopics);
router.get('/:topicId', handlers.getTopicById);
router.post('/:surveyType', middlewares.verifyAdminRole, handlers.createTopic);
router.delete('/:topicId', handlers.deleteTopic);

module.exports = router;
