const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'dev.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('--- USERS ---');
  db.each("SELECT id, email, role, isActive FROM users", (err, row) => {
    if (err) console.error(err);
    else console.log(row);
  });

  console.log('--- CATEGORIES ---');
  db.each("SELECT id, name FROM categories", (err, row) => {
    if (err) console.error(err);
    else console.log(row);
  });

  console.log('--- PRODUCTS ---');
  db.each("SELECT id, name FROM products LIMIT 5", (err, row) => {
    if (err) console.error(err);
    else console.log(row);
  });
});

db.close();
