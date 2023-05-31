const EventTypes = {
  SITUATION: 1,
  EPHEMERIS: 2
};

const SurveyTypes = {
  TEACHER: 'teacher',
  STUDENT: 'student'
};

const RoleTypes = {
  ADMIN: 'Administrator',
  USER: 'User'
};

const FeedbackStatus = {
  FINISHED: 1,
  NOT_FINISHED: 0
};

const PonderationTypes = {
  TEACHER: 0.3,
  STUDENT: 0.7
};

module.exports = {
  EventTypes,
  SurveyTypes,
  RoleTypes,
  FeedbackStatus,
  PonderationTypes
};
