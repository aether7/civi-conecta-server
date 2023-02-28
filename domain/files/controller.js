const uuid = require('uuid');
const { tryCatch } = require('../../helpers/controller');
const repositories = require('../../repositories');
const services = require('../../services');
const dto = require('./dto');

const uploadLessonFile = async (req, res) => {
  const lessonId = req.params.lessonId;
  const folder = await repositories.lesson.findFTPDataById(lessonId);
  const unitNumber = String(folder.unit_number).padStart(2, '0');
  const lessonNumber = String(folder.lesson_number).padStart(2, '0');
  const folderPath = `${folder.alias}/unidad${unitNumber}/clase${lessonNumber}`;
  const fileName = req.body.originalFilename;
  const filePath = req.file.path;

  await services.ftp.sendFile(folderPath, fileName, filePath);

  const payload = {
    alias: uuid.v4(),
    filename: req.body.originalFilename,
    filepath: services.ftp.savedFilename,
    filesize: req.file.size,
    mimetype: req.file.mimetype,
    lessonId
  };

  const fileInfo = await repositories.document.create(payload);
  res.json({ ok: true, file: dto.mapFile(fileInfo) });
};

module.exports = {
  uploadLessonFile: tryCatch(uploadLessonFile)
};
