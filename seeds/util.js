async function store(Model, collection) {
  for (const entity of collection) {
    await Model.create(entity);
  }
}

module.exports = {
  store
};
