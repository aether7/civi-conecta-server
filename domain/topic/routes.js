const { Router } = require('express');
const handlers = require('./controller');
const middlewares = require('../../middlewares/authentication');
const router = Router();

router.get('/type/:surveyType', handlers.getTopics);
router.get('/:topicId', handlers.getTopicById);
router.post('/:surveyType', middlewares.verifyAdminRole, handlers.createTopic);
router.put('/:topicId', middlewares.verifyAdminRole, handlers.updateTopic);
router.delete('/:topicId', middlewares.verifyAdminRole, handlers.deleteTopic);
router.delete('/question/:questionId', middlewares.verifyAdminRole, handlers.deleteQuestion);

module.exports = router;
