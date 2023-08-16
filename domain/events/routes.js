const { Router } = require('express');
const handlers = require('./controller');
const router = Router();

router.get('/:eventType/grade/:gradeId', handlers.getEventsByType);
router.get('/:eventType/:eventId', handlers.getEventById);

router.post('/:eventType', handlers.createEvent);
router.delete('/:eventId', handlers.deleteEvent);

module.exports = router;
