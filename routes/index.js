const { Router } = require('express');
const middlewares = require('../middlewares/authentication');
const router = Router();
const routesWithAuthToken = Router();

router.use('/auth', require('./auth.route'));

routesWithAuthToken.use(middlewares.verifyLoginToken);
routesWithAuthToken.use(middlewares.verifyActiveState);
routesWithAuthToken.use('/topics', require('./topics.route'));
routesWithAuthToken.use('/grades', require('./grades.route'));
routesWithAuthToken.use('/units', require('./units.route'));
routesWithAuthToken.use('/events', require('./events.route'));
routesWithAuthToken.use('/establishments', require('./establishments.route'));
routesWithAuthToken.use('/surveys', require('./surveys.route'));

router.use(routesWithAuthToken);

router.use((req, res, next) => {
  res.status(404).json({ ok: false, error: 'resource not found' });
});

router.use((err, req, res, next) => {
  req.logger.error(err.stack);
  res.status(500).json({ ok: false, error: err.message });
});

module.exports = router;
