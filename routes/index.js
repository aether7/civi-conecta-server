const { Router } = require('express');
const middlewares = require('../middlewares/authentication');
const router = Router();
const routesWithAuthToken = Router();

router.use('/auth', require('../domain/auth/routes'));
router.use('/feedback', require('../domain/feedback/routes'));

routesWithAuthToken.use(middlewares.verifyLoginToken);
routesWithAuthToken.use(middlewares.verifyActiveState);
routesWithAuthToken.use('/topics', require('../domain/topic/routes'));
routesWithAuthToken.use('/grades', require('../domain/grade/routes'));
routesWithAuthToken.use('/units', require('../domain/unit/routes'));
routesWithAuthToken.use('/lessons', require('../domain/lesson/routes'));
routesWithAuthToken.use('/establishments', require('../domain/establishment/routes'));
routesWithAuthToken.use('/surveys', require('../domain/survey/routes'));
routesWithAuthToken.use('/files', require('../domain/files/routes'));
routesWithAuthToken.use('/events', require('../domain/events/routes'));

router.use(routesWithAuthToken);

module.exports = router;
