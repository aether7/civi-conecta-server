const mapFile = (fileInfo) => {
  return {
    uuid: fileInfo.alias,
    name: fileInfo.filename
  };
};

module.exports = {
  mapFile
};
