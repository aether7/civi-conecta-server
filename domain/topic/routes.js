const { Router } = require('express');
const handlers = require('./controller');
const middlewares = require('../../middlewares/authentication');
const router = Router();

router.get('/', handlers.getTopics);
router.get('/:topicId/:surveyType', handlers.getTopicById);
router.post('/', middlewares.verifyAdminRole, handlers.createTopic);
router.delete('/:topicId', handlers.deleteTopic);

module.exports = router;
