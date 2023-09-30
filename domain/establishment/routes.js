const express = require('express');
const handlers = require('./controller');
const middlewares = require('../../middlewares/authentication');
const router = express.Router();

router.get('/', handlers.getEstablishments);

router.get('/:establishmentId/courses', handlers.getCoursesFromEstablishment);


router.get('/:establishmentId/grades', handlers.getGradesFromEstablishment);
router.get('/:establishmentId/grades/:gradeId', handlers.getEstablishmentGrades);
router.post('/', middlewares.verifyAdminRole, handlers.createEstablishment);
router.put('/:number/courses/teacher', middlewares.verifyAdminRole, handlers.updateTeacherToCourse);
router.put('/:number/courses', middlewares.verifyAdminRole, handlers.updateCoursesEstablishment);
router.put('/:id/status/:status', middlewares.verifyAdminRole, handlers.updateEstablishmentStatus);
router.get('/info/:uuid', handlers.getProfile);
router.get('/:establishmentId/course/:courseId/teachers', handlers.getTeacherInfo);
router.get('/:establishmentId/teachers', handlers.getTeachersFromEstablishment);

module.exports = router;
