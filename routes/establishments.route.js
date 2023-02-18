const express = require('express');
const handlers = require('../domain/establishment/controller');
const middlewares = require('../middlewares/authentication');
const router = express.Router();

router.get('/', handlers.getEstablishments);
router.post('/', middlewares.verifyAdminRole, handlers.createEstablishment);
router.put('/:number/courses/teacher', middlewares.verifyAdminRole, handlers.updateTeacherToCourse);
router.put('/:number/courses', middlewares.verifyAdminRole, handlers.updateCoursesEstablishment);

module.exports = router;
