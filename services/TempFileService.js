const fs = require('fs');
const uuid = require('uuid');

class TempFileService {
  createFileStream() {
    const name = `/tmp/${uuid.v4()}`;
    const writer = fs.createWriteStream(name);

    return {
      writer,
      get reader() {
        return fs.createReadStream(name);
      },
      unlink(time=60000) {
        setTimeout(() => {
          writer.close();
          fs.unlinkSync(name);
        }, time);
      }
    };
  }
}

module.exports = TempFileService;
