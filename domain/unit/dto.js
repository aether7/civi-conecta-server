const mapUnit = (unit) => {
  return {
    id: unit.id,
    number: unit.number,
    description: unit.description,
    title: unit.title
  };
};

module.exports = {
  mapUnit
};
