const { Router } = require('express');
const middlewares = require('../middlewares/authentication');
const router = Router();
const routesWithAuthToken = Router();

routesWithAuthToken.use(middlewares.verifyLoginToken);
routesWithAuthToken.use(middlewares.verifyActiveState);
routesWithAuthToken.use('/units', require('./units.v2'));
routesWithAuthToken.use('/establishments', require('./establishments.v2'));
routesWithAuthToken.use('/grades', require('./grades.v2'));
routesWithAuthToken.use('/topics', require('./topics.v2'));

// router.use(require('./units'));
// previousRoutes.use(require('./users'));
// previousRoutes.use(require('./events'));
// previousRoutes.use(require('./grades'));
// previousRoutes.use(require('./exceptions'));
// previousRoutes.use(require('./classes'));
// previousRoutes.use(require('./files'));
// previousRoutes.use(require('./establishments'));
// previousRoutes.use(require('./surveys'));
// previousRoutes.use(require('./topics'));

router.use('/auth', require('./auth'));
router.use(routesWithAuthToken);

router.use((req, res, next) => {
  res.status(404).json({ ok: false, error: 'resource not found' });
});

router.use((err, req, res, next) => {
  req.logger.error(err.stack);
  res.status(500).json({ ok: false, error: err.message });
});

module.exports = router;
