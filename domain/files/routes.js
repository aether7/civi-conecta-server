const { Router } = require('express');
const multer = require('multer');
const handlers = require('./controller');

const upload = multer({ dest: '/tmp/uploads' });
const router = Router();

router.get('/:aliasId', handlers.getFile);
router.post('/lessons/:lessonId', upload.single('file'), handlers.uploadLessonFile);
router.delete('/:aliasId', handlers.deleteLessonFile);
router.get('/lessons/:lessonId', handlers.downloadZipfile);

module.exports = router;
