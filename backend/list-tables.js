const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'dev.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('--- TABLES ---');
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
    if (err) console.error(err);
    else console.log(rows);
  });
});

db.close();
