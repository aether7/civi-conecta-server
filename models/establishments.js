const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validations = require('../helpers/validations');
const modelHelper = require('../helpers/model');
const { Schema } = mongoose;
const {
  defaultSchemaOptions,
  required,
  types,
  requiredTypes,
  uniqueTypes,
  errorMessages,
  normalStringData
} = modelHelper;


const establishmentSchema = new Schema({
  number: uniqueTypes.number,
  name: normalStringData(requiredTypes.string, validations.validateText),
  active: types.boolean,
  courses: {
    type: [{
      grade: {
        type: Schema.Types.ObjectId,
        ref: 'grade'
      },
      letters: {
        type: [{
          character: normalStringData(types.string, validations.validateLetterAToZ),
          students: {
            type: [{
              name: normalStringData(requiredTypes.string, validations.validateText),
              run: normalStringData(requiredTypes.string,  validations.validateRun),
              surveys: {
                type: [{
                  survey: {
                    type: Schema.Types.ObjectId,
                    ref: 'survey',
                    required
                  },
                  alternative: normalStringData(requiredTypes.string, validations.validateLetterAToD)
                }],
                default: []
              }
            }],
            required
          }
        }],
        required
      }
    }],
    default: []
  }
}, defaultSchemaOptions);

establishmentSchema.methods.toJSON = function () {
  const establishment = this.toObject();
  establishment.courses.forEach((c) => delete c._id);
  delete establishment._id;
  delete establishment.__v;
  return establishment;
};

establishmentSchema.plugin(uniqueValidator, errorMessages.unique);

module.exports = mongoose.model('establishment', establishmentSchema);
