const tap = require('tap');
const { mapSurveys } = require('../domain/survey/dto');
const mock = require('./mocks/surveys.mock.json');

tap.test('domain/survey/dto.mapSurveys', (t) => {
  t.test('mapping survey with 1 survey', (t) => {
    const actual = mapSurveys(mock);
    t.equal(actual[0].id, '1');
    t.end();
  });

  t.test('mapping the same survey with 2 questions', (t) => {
    const actual = mapSurveys(mock);
    t.equal(actual[0].questions[0].question, 'que le pasa a lupita');
    t.equal(actual[0].questions[1].question, 'cual es el mejor anime de estos');
    t.end();
  });

  t.test('getting the 1st question with alternatives correctly', (t) => {
    const actual = mapSurveys(mock);
    const [q1, q2] = actual[0].questions;
    const a1 = q1.alternatives;
    const a2 = q2.alternatives;
    t.equal(a1.length, 4);
    t.equal(a2.length, 4);
    t.equal(a1[0].alternative, 'de que me estas hablando ?');
    t.equal(a2[2].alternative, 'Naruto');
    t.end();
  });

  t.end();
});
