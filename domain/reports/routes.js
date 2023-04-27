const { Router } = require('express');
const handlers = require('./controller');
const router = Router();

router.get('/student-completion/:teacherUUID', handlers.checkStudentCompletion);
router.get('/student-answers/:teacherUUID', handlers.checkStudentAnswersByQuestion);

module.exports = router;
