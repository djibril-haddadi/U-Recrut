var mysql = require("mysql");
var pool = mysql.createPool({
host: "tuxa.sme.utc",
user: "ai16p032",
password: "your_password",
database: "ai16p032",
connectionLimit: 10,
enableKeepAlive: true,
acquireTimeout: 5000,
waitForConnections: true
});
module.exports = pool;