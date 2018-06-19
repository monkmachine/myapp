var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100,
    connectTimeout: 5000,
    acquireTimeout: 5000,
    queueLimit: 30,
    host: 'localhost',
    user: 'dan',
    password: '1',
    database: 'ep_ico',
    multipleStatements: true,
});


var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        if (err) return callback(err);
        callback(err, connection);
    });
};

pool.on('acquire', function(connection) {
    console.log('Connection %d acquired', connection.threadId);
});
module.exports = getConnection;