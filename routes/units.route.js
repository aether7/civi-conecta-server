const { Router } = require('express');
const handlers = require('../domain/unit/controller');
const middlewares = require('../middlewares/authentication');
const router = Router();

router.get('/', handlers.getUnitsByGrade);
router.post('/', middlewares.verifyAdminRole, handlers.createUnit);
router.put('/', middlewares.verifyAdminRole, handlers.updateUnit);
router.delete('/', middlewares.verifyAdminRole, handlers.deleteUnit);

module.exports = router;
