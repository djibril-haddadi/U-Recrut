var mysql = require("mysql");
var pool = mysql.createPool({
host: "tuxa.sme.utc", //ou localhost
user: "ai16p032",
password: "your_password",
database: "ai16p032"
});
module.exports = pool;