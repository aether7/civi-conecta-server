const defaultSchemaOptions = { timestamps: true };
const required = [true, "{PATH} is required"];

const normalStringData = (stringOptions, validate) => ({
  ...stringOptions,
  validate,
});

const types = {
  string: { type: String, trim: true },
  number: { type: Number, min: 1 },
  boolean: { type: Boolean, default: true }
};

const requiredTypes = {
  string: { ...types.string, required },
  number: { ...types.number, required }
};

const uniqueTypes = {
  number: {
    ...types.number,
    required,
    unique: true
  }
};

const errorMessages = {
  unique: { message: "{PATH} must be unique" }
};

module.exports = {
  defaultSchemaOptions,
  required,
  types,
  requiredTypes,
  uniqueTypes,
  errorMessages,
  normalStringData
};
