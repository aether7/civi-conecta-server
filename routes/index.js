const { Router } = require('express');
const middlewares = require('../middlewares/authentication');
const sse = require('../helpers/sse');
const router = Router();
const routesWithAuthToken = Router();

router.get('/stream-events', (req, res) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };

  res.writeHead(200, headers);
  const subscriptor = sse.add(res);

  req.on('close', () => {
    req.logger.info(`connection from ${subscriptor.id} was closed`);
    subscriptor.dispose();
  });
});

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
routesWithAuthToken.use('/events', require('../domain/events/routes'));
routesWithAuthToken.use('/reports', require('../domain/reports/routes'));
routesWithAuthToken.use('/profile', require('../domain/profile/routes'));
routesWithAuthToken.use('/courses', require('../domain/course/routes'));

router.use(routesWithAuthToken);

module.exports = router;
