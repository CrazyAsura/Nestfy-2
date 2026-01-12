
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'dev.db';
const rawPath = dbUrl.replace('file:', '');
const database = path.isAbsolute(rawPath) ? rawPath : path.resolve(__dirname, rawPath);

console.log(`Checking database at: ${database}`);

const db = new sqlite3.Database(database);

db.serialize(() => {
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
    if (err) {
      console.error('Error checking tables:', err);
      return;
    }
    if (!row) {
      console.error("Table 'users' does not exist!");
      return;
    }
    console.log("Table 'users' exists.");

    db.all("SELECT id, email, name, role, isActive, length(password) as pass_len FROM users", (err, rows) => {
      if (err) {
        console.error('Error querying users:', err);
        return;
      }
      console.log(`Found ${rows.length} users:`);
      rows.forEach(user => {
        console.log(`- ${user.email} (${user.name}) | Role: ${user.role} | Active: ${user.isActive} | PassLen: ${user.pass_len}`);
      });
    });

    db.all("SELECT count(*) as count FROM categories", (err, rows) => {
        if (!err) console.log(`Found ${rows[0].count} categories.`);
    });

    db.all("SELECT count(*) as count FROM products", (err, rows) => {
        if (!err) console.log(`Found ${rows[0].count} products.`);
        db.close();
    });
  });
});
