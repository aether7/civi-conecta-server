const { Router } = require('express');
const handlers = require('./controller');
const router = Router();

router.get('/:teacherUUID/planning', handlers.getCurrentPlanning);
router.put('/:teacherUUID/planning', handlers.updateCurrentPlanning);

module.exports = router;
