const { Router } = require('express');
const handlers = require('./controller');
const middlewares = require('../../middlewares/authentication');
const router = Router();

router.get('/:unitId/dashboard', handlers.getUnitDashboardById);
router.get('/:unitId/status/:teacherUUID', handlers.getUnitStatusByTeacher);
router.put('/:unitId/status/:teacherUUID', handlers.updateUnitStatusByTeacher);
router.get('/:unitId', handlers.getUnitById);
router.get('/grade/:gradeId', handlers.getUnitsByGrade);
router.get('/teacher/:uuid', handlers.getUnitsByTeacherAlias);
router.post('/', middlewares.verifyAdminRole, handlers.createUnit);
router.delete('/:unitId', middlewares.verifyAdminRole, handlers.deleteUnit);

module.exports = router;
