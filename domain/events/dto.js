const mapEvent = (data) => {
  return {
    id: data.id,
    number: data.number,
    title: data.title,
    description: data.description,
    date: data.date
  };
};

module.exports = {
  mapEvent
};
