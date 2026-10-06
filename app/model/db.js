var mysql = require('mysql');
require('dotenv').config();

var pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'urecrut',
  connectionLimit: 10,
  enableKeepAlive: true,
  acquireTimeout: 5000,
  waitForConnections: true,
});

module.exports = pool;
