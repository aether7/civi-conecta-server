const { isValidRun } = require('./index');

const validateLetterAToZ = {
  validator: (value) => /^[A-Za-z]{1}$/.test(value),
  message: (props) => `${props.path} must be between A and Z`,
};

const validateText = {
  validator: (value) => /^.{1,}$/.test(value),
  message: (props) => `${props.path} must be at least 1 character`,
};

const validateRun = {
  validator: (value) => isValidRun(value),
  message: (props) => `${props.path} must have correct format`,
};

const validateLetterAToD = {
  validator: (value) => /^[A-Da-d]{1}$/.test(value),
  message: (props) => `${props.path} must be between A and D`,
};

module.exports = {
  validateLetterAToZ,
  validateText,
  validateRun,
  validateLetterAToD
};
