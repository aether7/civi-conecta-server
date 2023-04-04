const EventTypes = {
  SITUATION: 1,
  EPHEMERIS: 2
};

const SurveyTypes = {
  TEACHER: 'teacher',
  STUDENT: 'student',
  TEACHER_ID: 1,
  STUDENT_ID: 2
};

const RoleTypes = {
  ADMIN: 'Administrator',
  USER: 'User'
};

const FeedbackStatus = {
  FINISHED: 1,
  NOT_FINISHED: 0
};

module.exports = { EventTypes, SurveyTypes, RoleTypes, FeedbackStatus };
