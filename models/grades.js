const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { uniqueMessage, schemaOptions } = require('../constants');

const gradeSchema = new mongoose.Schema({
  level: { type: String }
}, schemaOptions);

gradeSchema.methods.toJSON = function () {
  const grade = this.toObject();
  delete grade._id;
  delete grade.__v;
  return grade;
};

gradeSchema.plugin(uniqueValidator, uniqueMessage);

module.exports = mongoose.model('grade', gradeSchema);
