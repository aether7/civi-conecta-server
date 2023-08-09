const uuid = require('uuid');
const { wrapRequests } = require('../../helpers/controller');
const repositories = require('../../repositories');
const services = require('../../services');
const LessonPathCreator = require('../../helpers/LessonPathCreator');
const dto = require('./dto');
const sse = require('../../helpers/sse');


const getFile = async (req, res) => {
  sse.publish({ message: 'Solicitando el archivo al FTP', type: 'notification' });
  const aliasId = req.params.aliasId;
  const file = await repositories.document.findByAlias(aliasId);
  const tempFile = services.tempfile.createFileStream();

  await services.ftp.serveFile(tempFile.writer, file.filepath, file.filesize);

  sse.publish({ message: 'Preparando el archivo', type: 'notification' });

  res.set('Content-Type', file.mimetype);
  tempFile.reader.pipe(res);
  tempFile.unlink();
};

const uploadLessonFile = async (req, res) => {
  sse.publish({
    message: 'enviando el archivo hacia el servidor FTP',
    type: 'notification'
  });

  const lessonId = req.params.lessonId;
  const fileName = req.body.originalFilename;
  const filePath = req.file.path;
  const fileSize = req.file.size;
  const folderResult = await repositories.lesson.findFTPDataById(lessonId);
  const folderPath = new LessonPathCreator(folderResult).getLessonPath();

  const filepath = await services.ftp.sendFile({
    folderPath,
    fileName,
    filePath,
    fileSize
  });

  const payload = {
    alias: uuid.v4(),
    filename: req.body.originalFilename,
    filesize: req.file.size,
    mimetype: req.file.mimetype,
    filepath,
    lessonId
  };

  const fileInfo = await repositories.document.create(payload);
  res.json({ ok: true, file: dto.mapFile(fileInfo) });
};

const deleteLessonFile = async (req, res) => {
  const aliasId = req.params.aliasId;
  const file = await repositories.document.findByAlias(aliasId);
  await services.ftp.deleteFile(file.filepath);
  await repositories.document.remove(file.id);
  res.json({ ok: true });
};

const downloadZipfile = async (req, res) => {
  const lessonId = req.params.lessonId;
  const folderPath = await repositories.document.findFolderPathFromLesson(lessonId);
  const zipBuffer = await services.ftp.downloadFTPFolder(folderPath);
  res.set('Content-Type', 'application/zip');
  res.send(zipBuffer);
};

module.exports = wrapRequests({
  getFile,
  uploadLessonFile,
  deleteLessonFile,
  downloadZipfile
});
