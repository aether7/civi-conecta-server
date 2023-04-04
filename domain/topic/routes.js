const { Router } = require('express');
const handlers = require('./controller');
const middlewares = require('../../middlewares/authentication');
const router = Router();

router.get('/', handlers.getTopics);
router.get('/:topicId/:questionType', handlers.getTopicById);
router.post('/', middlewares.verifyAdminRole, handlers.createTopic);
router.put('/:topicId', middlewares.verifyAdminRole, handlers.updateTopic);
router.delete('/:topicId', middlewares.verifyAdminRole, handlers.deleteTopic);
router.delete('/:topicId/question/:questionId', middlewares.verifyAdminRole, handlers.deleteQuestion);

module.exports = router;
