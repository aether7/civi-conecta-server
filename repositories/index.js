const knex = require('knex');
const knexConfig = require('../knexfile');
const config = require('../config');
const connection = knex(knexConfig[config.env.nodeEnv]);

const EstablishmentRepository = require('./EstablishmentRepository');
const UserRepository = require('./UserRepository');
const GradeRepository = require('./GradeRepository');
const UnitRepository = require('./UnitRepository');
const ClassRepository = require('./ClassRepository');
const TopicRepository = require('./TopicRepository');
const StudentRepository = require('./StudentRepository');
const CourseRepository = require('./CourseRepository');
const CourseStudentRepository = require('./CourseStudentRepository');
const EventRepository = require('./EventRepository');
const PlanningRepository = require('./PlanningRepository');
const SurveyRepository = require('./SurveyRepository');
const QuestionRepository = require('./QuestionRepository');
const AlternativeRepository = require('./AlternativeRepository');

const eventRepository = new EventRepository(connection);
const courseRepository = new CourseRepository(connection);
const studentRepository = new StudentRepository(connection);
const courseStudentRepository = new CourseStudentRepository(connection);
const userRepository = new UserRepository(connection);
const gradeRepository = new GradeRepository(connection);
const classRepository = new ClassRepository(connection);
const unitRepository = new UnitRepository(connection);
const topicRepository = new TopicRepository(connection);
const planningRepository = new PlanningRepository(connection);
const surveyRepository = new SurveyRepository(connection);
const questionRepository = new QuestionRepository(connection);
const alternativeRepository = new AlternativeRepository(connection);
const establishmentRepository = new EstablishmentRepository(connection, {
  courseRepository,
  studentRepository,
  courseStudentRepository,
  userRepository
});

module.exports = {
  user: userRepository,
  grade: gradeRepository,
  unit: unitRepository,
  class: classRepository,
  topic: topicRepository,
  student: studentRepository,
  course: courseRepository,
  courseStudent: courseStudentRepository,
  establishment: establishmentRepository,
  event: eventRepository,
  planning: planningRepository,
  survey: surveyRepository,
  question: questionRepository,
  alternative: alternativeRepository
};
