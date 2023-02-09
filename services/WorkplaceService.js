const repositories = require('../repositories');

class WorkplaceService {
  async getWorkPlaces(workplaces, minimalEstablishments = [], minimalWorkplaces = []) {
    const establishments = await repositories.establishment.populateEstablishments(workplaces);

    establishments.forEach((e) =>
      e.courses.forEach((c) =>
        c.letters.forEach((l) =>
          minimalEstablishments.push({
            establishment: e._id,
            grade: c.grade._id,
            letter: l._id,
          })
        )
      )
    );

    workplaces.forEach((w) =>
      w.courses.forEach((c) =>
        c.letters.forEach((l) =>
          minimalWorkplaces.push({
            establishment: w.establishment,
            grade: c.grade,
            letter: l.character,
          })
        )
      )
    );

    const specificWorkplaces = minimalEstablishments.filter((me) =>
      minimalWorkplaces.some(
        (mw) =>
          `${mw.establishment}` === `${me.establishment}` &&
          `${mw.grade}` === `${me.grade}` &&
          `${mw.letter}` === `${me.letter}`
      )
    );

    const fullWorkplaces = specificWorkplaces.length
      ? establishments.filter((e) =>
        specificWorkplaces.some((sw) => sw.establishment === e._id)
      )
      : [];

    fullWorkplaces.forEach((e, ei) =>
      e.courses.forEach((c, ci) =>
        specificWorkplaces.some(
          (sw) => sw.establishment === e._id && sw.grade === c.grade._id
        )
          ? c.letters.forEach(
            (l, li) =>
              !specificWorkplaces.some(
                (sw) =>
                  sw.establishment === e._id &&
                  sw.grade === c.grade._id &&
                  sw.letter === l._id
              ) && fullWorkplaces[ei].courses[ci].letters.splice(li, 1)
          )
          : fullWorkplaces[ei].courses.splice(ci, 1)
      )
    );

    const finalWorkplacesWithoutId = fullWorkplaces.map((e) => ({
      active: e.active,
      number: e.number,
      name: e.name,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      courses: e.courses.map((c) => ({
        grade: {
          level: c.grade.level,
          createdAt: c.grade.createdAt,
          updatedAt: c.grade.updatedAt,
        },
        letters: c.letters.map((l) => ({
          character: l.character,
          students: l.students.map((s) => ({
            name: s.name,
            run: s.run,
            surveys: s.surveys.map((s) => ({
              ...s.survey._doc,
              alternatives: s.survey.alternatives
                .map(({ letter, description, value }) => ({
                  letter,
                  description,
                  value,
                }))
                .sort((a, b) =>
                  a.letter > b.letter ? 1 : a.letter < b.letter ? -1 : 0
                ),
              alternative: s.alternative,
            })),
          })),
          surveys: this.getSurveysFromGradeAndCharacter(
            workplaces,
            e._id,
            c.grade._id,
            l._id
          ),
        })),
      })),
    }));

    return finalWorkplacesWithoutId;
  }

  getSurveysFromGradeAndCharacter(workplaces, establishment, grade, character, surveys = []) {
    return !workplaces.forEach(
      (w) =>
        `${w.establishment}` === `${establishment}` &&
        w.courses.forEach(
          (c) =>
            `${c.grade}` === `${grade}` &&
            c.letters.forEach(
              (l) =>
                `${l.character}` === `${character}` &&
                Object.assign(surveys, l.surveys)
            )
        )
    ) &&
      surveys.map((s) => ({
        ...s.survey._doc,
        alternatives: s.survey.alternatives
          .map(({ letter, description, value }) => ({
            letter,
            description,
            value,
          }))
          .sort((a, b) => (a.letter > b.letter ? 1 : a.letter < b.letter ? -1 : 0)),
        alternative: s.alternative,
      }));
  }

  getUserWithWorkplaces = (user, workplaces) => {
    delete user._doc._id;
    delete user._doc.password;
    delete user._doc.__v;
    return { ...user._doc, workplaces };
  }
}

module.exports = WorkplaceService;
