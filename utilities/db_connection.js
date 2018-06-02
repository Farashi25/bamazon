mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "dummy_db",
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});


module.exports = connection;
