var mysql = require('mysql');
var connection = mysql.createConnection({
    //connecting to r9
        host: 'blah',
        user: 'blah',
        password: 'blah',
        database: 'blah'
});
var results;
//%Y-%c-%dT


exports.data = {};
// '
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

// function processRow (row) {
//   fs.appendFile('your-file.csv', row.join(';'), function (err) {
//     connection.resume();
//   });
// }

exports.Query = function(query, cb, key) {
    connection.query(query, function(err, rows, fields) {
        if (err) {
            throw err;
        }

        exports.data[key] = rows;
        if (typeof cb == 'function') {
            cb.call('undefined', err, rows, fields)    
        }
        

    });
};


exports.connection = connection;
