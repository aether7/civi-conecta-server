const { errorResponse } = require('../helpers/http');

const isValidPlanning = planning => {
  if (Object.prototype.toString.call(planning) !== '[object Object]') {
    return false;
  }

  return Object.keys(planning).length > 0;
};


const getInitialPlanning = ({
  topic,
  materials,
  startActivity,
  mainActivity,
  endActivity,
}) => {
  const tryCatch = (fn) => {
    try {
      return fn();
    } catch (err) {
      return false;
    }
  };

  const conditions = [
    () => topic.trim().length > 0,
    () => materials.teacher.length > 0,
    () => materials.student.length > 0,
    () => startActivity.trim().length > 0,
    () => mainActivity.trim().length > 0,
    () => endActivity.trim().length > 0,
  ];

  return conditions.filter(fn => tryCatch(fn)).length == conditions.length;
};

const setPlanningData = (req, res, next) => {
  const { planning } = req.body;
  const validPlanning = isValidPlanning(planning);
  const hasPlanning = validPlanning && getInitialPlanning(planning);

  if (!hasPlanning) {
    return errorResponse(res, 400, 'No planning available');
  }

  next();
};

module.exports = {
  setPlanningData,
  isValidPlanning,
  getInitialPlanning
};
