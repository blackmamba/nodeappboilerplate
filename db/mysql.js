var mysql = require('mysql');
var connection = mysql.createConnection({
    //connecting to r9
        host: 'blah.com',
        user: 'blah',
        password: 'blah',
        database: 'blah'
});
var results;
//%Y-%c-%dT

//allowing dates to be passed to the queries through a function, it kind of acts like 
//prepared statements. As there is no direct support for P.S. in node-mysql yet
var query1 = function(date){
    return 'SELECT DATE_FORMAT(created, "%H:%i") as created ,count(*) as `count` FROM `blah` WHERE `id`=1 AND created>="'+ date + ' 00:00:00" AND created<="' + date + ' 23:59:59" GROUP BY day(created) ,hour(created), minute(created) ORDER BY day(created) ,hour(created), minute(created)';
};
var query2 = function(date) {
    return 'SELECT DATE_FORMAT(created, "%H:%i") as created, count(*) as `postback` FROM `blah` WHERE created>="' + date + ' 00:00:00" and created<="' + date + ' 23:59:59" GROUP BY day(created) ,hour(created), minute(created) ORDER by day(created),hour(created), minute(created)';
}
//var joinQuery = 'SELECT hour(delivery.created) as `hour`, hour(tti_hit.created) as `postbackshour`,delivery.count(*) as deliveries, tti_hit.count(*) as postbacks FROM `delivery` LEFT JOIN `tti_hit` WHERE `delivery.type_id`=1 AND created>="2014-05-19 00:00:00" AND created<="2014-05-19 23:59:59" ON hour=postbackshour GROUP BY `day`,`hour`,`minute` ORDER BY `day`,`hour`,`minute` LIMIT 100';

exports.data = {};
// '
// var query = 'SELECT * from `delivery` LIMIT 10';
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

exports.query1 = function(cb, date, key) {
    console.log("count query called: " + query1(date));
    console.log("typeof connection: " + typeof connection);
    connection.query(query1(date), function(err, rows, fields) {
        if (err) {
            throw err;
        }

        exports.data[key] = rows;
        if (typeof cb == 'function') {
            cb.call('undefined', err, rows, fields)    
        }
        

    });
};


exports.query2 = function(cb, date) {
    console.log("postback query called: " + query2(date));
   // console.log("typeof connection: " + typeof connection);
    connection.query(query2(date), function(err, rows, fields) {
        if (err) {
            throw err;
        }

        exports.data.postbacks = rows;
        if (typeof cb == 'function') {
            cb.call('undefined', err, rows, fields)    
        }
        

    });

    // query.on('fields', function(fields){
    //     processRow(fields);
    // })
    // .on('result', function(){


    // })
};



exports.connection = connection;

// connection.query(query, function(err, results, fields){
//     console.log("entering query callback");
//     if (err) throw err;
//     console.log("results: " + JSON.toString(results));
// });
// connection.end();