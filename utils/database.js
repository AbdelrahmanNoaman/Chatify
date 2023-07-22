const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "usersTest",
  password: "Aa37740917",
});

module.exports = pool.promise();
