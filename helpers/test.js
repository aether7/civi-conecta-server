const makeStub = () => {
  function fn() {
    fn.hasBeenCalled = true;
  }

  fn.hasBeenCalled = false;

  return fn;
};

const makeFakeResponse = () => {
  return {
    _status: null,
    _json: null,
    status(statusCode) {
      this._status = statusCode;
      return this;
    },
    json(json) {
      this._json = json;
      return this;
    }
  };
};

module.exports = { makeStub, makeFakeResponse };
