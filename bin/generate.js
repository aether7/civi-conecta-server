const mongoose = require('mongoose');
const Grades = require('../models/grades');
const Users = require('../models/users');
const { store } = require('./util');
const data = require('../seeds/data/data_000.json');

mongoose.set('strictQuery', false);

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/civi-conecta-db', {});
  await store(Grades, data.mongo.grades);
  await store(Users, data.mongo.users);
  console.log('done');
  process.exit(0);
}

main();
