const { Router } = require('express');
const handlers = require('./controller');
const router = Router();

router.get('/:lessonId', handlers.getLessonById);
router.post('/', handlers.createLesson);
router.delete('/:lessonId', handlers.deleteLesson);

module.exports = router;
