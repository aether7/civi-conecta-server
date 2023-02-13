const mapUnit = (unit) => {
  return {
    id: unit.id,
    number: unit.number,
    description: unit.description
  };
};

module.exports = {
  mapUnit
};
