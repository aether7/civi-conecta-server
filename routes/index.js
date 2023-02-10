const { Router } = require('express');
const middlewares = require('../middlewares/authentication');
const router = Router();
const routesWithAuthToken = Router();

router.use('/auth', require('./auth'));

router.use(require('./users'));
router.use(require('./events'));
router.use(require('./grades'));
router.use(require('./exceptions'));
router.use(require('./classes'));
router.use(require('./files'));
router.use(require('./establishments'));
router.use(require('./surveys'));
router.use(require('./topics'));

routesWithAuthToken.use(middlewares.verifyLoginToken);
routesWithAuthToken.use(middlewares.verifyActiveState);

// router.use(require('./units'));
routesWithAuthToken.use('/units', require('./units.v2'));

router.use(routesWithAuthToken);

router.use(require('./404'));

module.exports = router;
