const path = require('path');
const { EventEmitter } = require('events');
const fs = require('fs/promises');
const { createReadStream } = require('fs');
const ftp = require('basic-ftp');
const AdmZip = require('adm-zip');
const repositories = require('../repositories/index');

const emitter = new EventEmitter();

emitter.on('FOLDER::REMOVE', (folderName) => {
  async function execute() {
    // this is to remove base folder
    const folderToDelete = folderName.split('/').slice(0, 3).join('/');
    await fs.rm(folderToDelete, { recursive: true, force: true });
  }

  execute();
});

class FTPService {
  constructor(rootFolder, { host, port, user, password, secure }) {
    this.rootFolder = rootFolder;
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.secure = secure;
    this.client = new ftp.Client();
    this.queue = new Map();
    // this.client.ftp.verbose = true
  }

  async sendFile(folderPath, fileName, filePath) {
    const remotePath = `/${this.rootFolder}/${folderPath}`;

    await this._getAccess();
    await this.client.ensureDir(remotePath);
    await this.client.cd(remotePath);
    await this.client.uploadFrom(createReadStream(filePath), fileName);
    await fs.unlink(filePath);
    await this._close();

    return `${remotePath}/${fileName}`;
  }

  async deleteFile(filepath) {
    await this._getAccess();
    await this.client.remove(filepath);
    return this._close();
  }

  async serveFile(stream, filepath) {
    await this._getAccess();
    await this.client.downloadTo(stream, filepath);
    await this._close();
    return stream;
  }

  async getLessonPath(lessonId) {
    const folder = await repositories.lesson.findFTPDataById(lessonId);
    const subfolder = this._getSubfolder(folder);
    const lessonNumber = String(folder.lesson_number ?? 1).padStart(2, '0');
    return `${folder.alias}/${subfolder}/clase${lessonNumber}`;
  }

  _getSubfolder(folder) {
    if (folder.unit_number) {
      const unitNumber = String(folder.unit_number).padStart(2, '0');
      return `unidad${unitNumber}`;
    }

    const eventNumber = String(folder.event_number).padStart(2, '0');
    return `evento${eventNumber}`;
  }

  async downloadFTPFolder(folderPath) {
    if (this.queue.has(folderPath)) {
      return this.queue.get(folderPath);
    }

    const promise = this._createPromiseDownload(folderPath);

    this.queue.set(folderPath, promise);
    return this.queue.get(folderPath);
  }

  _createPromiseDownload(folderPath) {
    const temporaryPath = path.join('/tmp/', folderPath);;

    return new Promise(resolve => {
      const execute = async () => {
        const zipFile = new AdmZip();
        await this._downloadRemoteFolder(folderPath, temporaryPath);
        zipFile.addLocalFolder(temporaryPath);
        resolve(zipFile.toBuffer());
      };

      execute();
    })
      .then((buffer) => {
        this.queue.delete(folderPath);
        emitter.emit('FOLDER::REMOVE', temporaryPath);
        return buffer;
      });
  }

  async _downloadRemoteFolder(folderPath, temporaryPath) {
    await this._getAccess();
    await this.client.cd(folderPath);
    await this.client.downloadToDir(temporaryPath);
    return this._close();
  }

  _getAccess() {
    return this.client.access({
      host: this.host,
      port: this.port,
      user: this.user,
      password: this.password,
      secure: this.secure
    });
  }

  _close() {
    return this.client.close();
  }
}

module.exports = FTPService;
