const { Router } = require('express');
const handlers = require('./controller');
const router = Router();

router.get('/:eventType', handlers.getEventsByType);
router.get('/:eventType/:eventId', handlers.getEventById);
router.post('/:eventType', handlers.createEvent);

module.exports = router;
