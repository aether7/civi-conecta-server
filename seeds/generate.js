const mongoose = require('mongoose');
const Grades = require('../models/grades');
const Users = require('../models/users');
const { store } = require('./util');
const data = require('./data.json');

mongoose.set('strictQuery', false);

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/civi-conecta-db', {});
  await store(Grades, data.grades);
  await store(Users, data.users);
  console.log('done');
  process.exit(0);
}

main();
