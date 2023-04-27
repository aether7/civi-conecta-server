const { Router } = require('express');
const handlers = require('./controller');
const router = Router();

router.get('/student-completion/:teacherUUID', handlers.checkStudentCompletion);
router.get('/student-answers/:teacherUUID/:questionId', handlers.checkStudentAnswersByQuestion);
router.get('/student-answers/:teacherUUID', handlers.checkStudentAnswers);

module.exports = router;
