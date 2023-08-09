const { Router } = require('express');
const multer = require('multer');
const handlers = require('./controller');
const sse = require('../../helpers/sse');

const upload = multer({ dest: '/tmp/uploads' });
const router = Router();

const onBeforeUpload = (req, res, next) => {
  sse.publish({
    message: 'enviando el archivo hacia el servidor',
    type: 'notification'
  });
  next();
};

router.get('/:aliasId', handlers.getFile);
router.delete('/:aliasId', handlers.deleteLessonFile);
router.get('/lessons/:lessonId', handlers.downloadZipfile);
router.post(
  '/lessons/:lessonId',
  onBeforeUpload,
  upload.single('file'),
  handlers.uploadLessonFile
);

module.exports = router;
