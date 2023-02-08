const Database = require('better-sqlite3');
let db;

function initDB() {
  if (db) {
    return db;
  }

  console.log('new db oe');
  db = new Database(':memory:', { verbose: console.log });
}


module.exports = initDB;
