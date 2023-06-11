const { Router } = require('express');
const handlers = require('./controller');
const middlewares = require('../../middlewares/authentication');
const router = Router();

router.get('/grade/:gradeId', handlers.getUnitsByGrade);
router.get('/:unitId', handlers.getUnitById);
router.get('/teacher/:uuid', handlers.getUnitsByTeacherAlias);
router.post('/', middlewares.verifyAdminRole, handlers.createUnit);
router.delete('/:unitId', middlewares.verifyAdminRole, handlers.deleteUnit);

module.exports = router;
