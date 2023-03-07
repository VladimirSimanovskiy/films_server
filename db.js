require('dotenv').config();
const Pool = require('pg').Pool;
const pool = new Pool({
  user: "postgres",
  password: process.env.PASS,
  host: "localhost",
  port: 5432,
  database: "Films"
});

module.exports = pool;