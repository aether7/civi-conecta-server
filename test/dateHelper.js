const tap = require('tap');
const { dateToMonthDay } = require('../helpers/date');

tap.test('dateToMonthDay', (t) => {
  t.test('dateToMonthDay(1/1) => 01-01', (t) => {
    const actual = dateToMonthDay('1/1');
    t.equal(actual, '01-01');
    t.end();
  });

  t.test('dateToMonthDay(10-12) => 12-10', (t) => {
    const actual = dateToMonthDay('10-12');
    t.equal(actual, '12-10');
    t.end();
  });

  t.end();
});
