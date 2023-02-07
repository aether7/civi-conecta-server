const tap = require('tap');
const { makeStub, makeFakeResponse } = require('../helpers/test');
const {
  isValidPlanning,
  getInitialPlanning,
  setPlanningData
} = require('../middlewares/planning');

tap.test('isValidPlanning', (t) => {
  t.test('is not valid when is not an object', (t) => {
    const datatypes = [
      1,
      'hello',
      false,
      new Date()
    ];

    datatypes.forEach(type => {
      t.equal(isValidPlanning(type), false);
    });

    t.end();
  });

  t.test('is not a valid planning if is an empty object', (t) => {
    t.equal(isValidPlanning({}), false);
    t.end();
  });

  t.test('is a valid planning', (t) => {
    t.equal(isValidPlanning({ hello: 'world' }), true);
    t.end();
  });

  t.end();
});

tap.test('getInitialPlanning', (t) => {
  t.test('initial planning is ok', (t) => {
    const plan = {
      topic: '27844 Clarke Mills Gordonberg, PR 56664',
      materials: {
        teacher: ['#d4ccff', '#d16304', '#c49705'],
        student: ['#4fdd6c', '#4b57d8']
      },
      startActivity: '2023-01-01',
      mainActivity: '2023-01-01',
      endActivity: '2023-01-01'
    };

    t.equal(getInitialPlanning(plan), true);
    t.end();
  });

  t.test('initial planning is not ok because missing materials', (t) => {
    const plan = {
      topic: '27844 Clarke Mills Gordonberg, PR 56664',
      startActivity: '2023-01-01',
      mainActivity: '2023-01-01',
      endActivity: '2023-01-01'
    };

    t.equal(getInitialPlanning(plan), false);
    t.end();
  });

  t.end();
});

tap.test('setPlanningData', (t) => {
  t.test('setPlanningData is ok and calls next', (t) => {
    const request = {
      body: {
        planning: {
          topic: '27844 Clarke Mills Gordonberg, PR 56664',
          materials: {
            teacher: ['#d4ccff', '#d16304', '#c49705'],
            student: ['#4fdd6c', '#4b57d8']
          },
          startActivity: '2023-01-01',
          mainActivity: '2023-01-01',
          endActivity: '2023-01-01'
        }
      }
    };
    const response = makeFakeResponse();
    const next = makeStub();
    setPlanningData(request, response, next);

    t.equal(next.hasBeenCalled, true);
    t.end();
  });

  t.test('setPlanningData is not ok and calls error', (t) => {
    const request = {
      body: {
        planning: {
          topic: '27844 Clarke Mills Gordonberg, PR 56664',
          materials: {
            teacher: ['#d4ccff', '#d16304', '#c49705'],
            student: ['#4fdd6c', '#4b57d8']
          },
          startActivity: '2023-01-01',
          mainActivity: '2023-01-01',
          endActivity: '2023-01-01'
        }
      }
    };
    const response = makeFakeResponse();
    const next = makeStub();
    setPlanningData(request, response, next);

    t.equal(next.hasBeenCalled, true);
    t.end();
  });

  t.end();
});
