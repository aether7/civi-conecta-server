class EntityNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RecordNotFoundError';
  }
}

class EntityAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EntityAlreadyExistsError';
  }
}

class EntityWithDependenciesError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EntityWithDependenciesError';
  }
}

module.exports = {
  EntityNotFoundError,
  EntityAlreadyExistsError,
  EntityWithDependenciesError
};
