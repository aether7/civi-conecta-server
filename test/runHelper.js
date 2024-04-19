const tap = require('tap');
const { isValidRun, getFormattedRun } = require('../helpers/rut');

tap.test('helpers/rut/isValidRun', (t) => {
  t.test('checking if a rut is correct', (t) => {
    const rut = '16104879-8';
    t.equal(isValidRun(rut), true);
    t.end();
  });

  t.test('checking if a rut is not correct', (t) => {
    const rut = '16104879-9';
    t.equal(isValidRun(rut), false);
    t.end();
  });

  t.test('check if a rut with K digit is ok', (t) => {
    const rut = '32266608-k';
    t.equal(isValidRun(rut), true);
    t.end();
  });

  t.test('when a rut does not have the value in string format', (t) => {
    const rut = 161048798;
    t.equal(isValidRun(rut), false);
    t.end();
  });

  t.end();
});

tap.test('helpers/rut/getFormattedRun', (t) => {
  t.test('format 161048798 into 16.104.879-8', (t) => {
    const originalRut = '161048798';
    t.equal(getFormattedRun(originalRut), '16.104.879-8');
    t.end();
  });

  t.test('returning format 1 => 1', (t) => {
    t.equal(getFormattedRun('1'), '1');
    t.end();
  });

  t.end();
});
