const express = require('express');
const handlers = require('./controller');
const middlewares = require('../../middlewares/authentication');
const router = express.Router();


router.get('/:courseId', handlers.findCourse);
router.get('/:courseId/students', handlers.findStudents);


module.exports = router;
