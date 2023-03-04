const fs = require('fs/promises');
const { createReadStream } = require('fs');
const ftp = require('basic-ftp');
const repositories = require('../repositories/index');

class FTPService {
  constructor(rootFolder, { host, port, user, password, secure }) {
    this.rootFolder = rootFolder;
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.secure = secure;
    this.client = new ftp.Client();
    this.savedFilename = null;
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
    const unitNumber = String(folder.unit_number).padStart(2, '0');
    const lessonNumber = String(folder.lesson_number).padStart(2, '0');
    return `${folder.alias}/unidad${unitNumber}/clase${lessonNumber}`;
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
