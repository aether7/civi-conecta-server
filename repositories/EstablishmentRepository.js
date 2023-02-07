const Establishments = require('../models/establishments');
const { doNothing, prop } = require('../helpers/functional');

class EstablishmentRepository {
  populateEstablishments(workplaces) {
    const query = {
      _id: { $in: workplaces.map(prop('establishment')) },
    };

    return Establishments.find(query)
      .populate([
        { path: "courses.grade" },
        {
          path: "courses.letters.students.surveys.survey",
          select: "-_id -__v",
          populate: { path: "topic", select: "-_id -__v" },
        },
      ])
      .exec()
      .catch(doNothing);
  }
}

module.exports = EstablishmentRepository;
