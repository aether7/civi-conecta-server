const { Router } = require('express');
const handlers = require('./controller');
const router = Router();

router.get('/:eventType', handlers.getEventsByType);
router.post('/:eventType', handlers.createEvent);

module.exports = router;
