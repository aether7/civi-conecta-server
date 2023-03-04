const mapFile = (fileInfo) => {
  return {
    uuid: fileInfo.alias,
    filename: fileInfo.filename
  };
};

module.exports = {
  mapFile
};
