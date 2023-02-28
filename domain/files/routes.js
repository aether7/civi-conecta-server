const { Router } = require('express');
const multer = require('multer');
const handlers = require('./controller');

const upload = multer({ dest: '/tmp/uploads' });
const router = Router();

router.post('/lessons/:lessonId', upload.single('file'), handlers.uploadLessonFile);

module.exports = router;
