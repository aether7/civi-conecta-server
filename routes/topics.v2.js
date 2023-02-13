const { Router } = require('express');
const handlers = require('../domain/topic/controller');
const middlewares = require('../middlewares/authentication');
const router = Router();

router.get('/', handlers.getTopics);
router.post('/', middlewares.verifyAdminRole, handlers.createTopic);

module.exports = router;
