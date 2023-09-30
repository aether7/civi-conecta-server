const express = require('express');
const handlers = require('./controller');
const middlewares = require('../../middlewares/authentication');
const router = express.Router();

router.get('/:courseId', handlers.findCourse);
router.get('/:courseId/students', handlers.findStudents);
router.post('/:courseId/students', handlers.addStudent);
router.put('/:courseId/teachers', handlers.assignTeacher);

module.exports = router;
