const { Router } = require('express');
const handlers = require('./controller');
const router = Router();

router.get('/', handlers.getEventsByGrade);
router.get('/:eventId', handlers.getEventById);
router.post('/', handlers.createEvent);
router.delete('/:eventId', handlers.deleteEvent);

module.exports = router;
