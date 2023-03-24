const tap = require('tap');
const { dateToMonthDay } = require('../helpers/date');

tap.test('dateToMonthDay', (t) => {
  t.test('dateToMonthDay(1/1) => 01-01', (t) => {
    const actual = dateToMonthDay('1/1');
    t.equal(actual, '01-01');
    t.end();
  });

  t.test('dateToMonthDay(10-12) => 10-12', (t) => {
    const actual = dateToMonthDay('10-12');
    t.equal(actual, '10-12');
    t.end();
  });

  t.test('dateToMonthDay(2023-07-13) => 07-13', (t) => {
    const actual = dateToMonthDay('2023-07-13');
    t.equal(actual, '07-13');
    t.end();
  });

  t.end();
});
