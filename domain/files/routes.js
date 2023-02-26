const { Router } = require('express');
const multer = require('multer');
const handlers = require('./controller');

const upload = multer({ dest: '/tmp' });
const router = Router();

router.post('/events/:eventId', upload.single('file'), handlers.uploadEventFile);

module.exports = router;
