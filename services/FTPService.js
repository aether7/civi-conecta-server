const fs = require('fs/promises');
const { createReadStream } = require('fs');
const ftp = require('basic-ftp');

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
  }

  async sendFile(folderPath, fileName, filePath) {
    const remotePath = `/${this.rootFolder}/${folderPath}`;

    await this._getAccess();
    await this.client.ensureDir(remotePath);
    await this.client.cd(remotePath);
    await this.client.uploadFrom(createReadStream(filePath), fileName);
    await fs.unlink(filePath);

    this.savedFilename = `${remotePath}/${fileName}`;

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
