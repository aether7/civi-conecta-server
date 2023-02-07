const mongoose = require('mongoose');
const { required, requiredStringData, validateText } = require('../constants');
const { normalStringData } = require('../helpers');
const { Schema } = mongoose;

const strData = normalStringData(requiredStringData, validateText);

const planningSchema = new Schema({
  topic: strData,
  materials: {
    type: [{
      teacher: {
        type: [strData],
        required
      },
      student: {
        type: [strData],
        required
      }
    }],
    required
  },
  keywords: {
    type: [strData],
    default: []
  },
  startActivity: strData,
  mainActivity: strData,
  endActivity: strData
});

planningSchema.methods.toJSON = function () {
  const planningS = this.toObject();
  delete planningS._id;
  delete planningS.__v;
  planningS.materials.forEach((m) => delete m._id);
  return planningS;
};

module.exports = planningSchema;
