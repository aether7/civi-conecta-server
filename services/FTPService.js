const path = require('path');
const { EventEmitter } = require('events');
const fs = require('fs/promises');
const { createReadStream } = require('fs');
const ftp = require('basic-ftp');
const AdmZip = require('adm-zip');
const TaskQueue = require('../helpers/TaskQueue');

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
    this.taskQueue = new TaskQueue();
    // this.client.ftp.verbose = true
  }

  sendFile(folderPath, fileName, filePath) {
    return this.taskQueue.add((done) => {
      const execute = async () => {
        const remotePath = `/${this.rootFolder}/${folderPath}`;
        await this._getAccess();
        await this.client.ensureDir(remotePath);
        await this.client.cd(remotePath);
        await this.client.uploadFrom(createReadStream(filePath), fileName);
        await fs.unlink(filePath);
        await this._close();
        done(`${remotePath}/${fileName}`);
      };

      execute();
    });
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

  downloadFTPFolder(folderPath) {
    return this.taskQueue.add((done) => {
      this._createPromiseDownload(folderPath)
        .then(buffer => done(buffer));
    });
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
