/*
 *This is a data access object for query transaction_ws database
 */

var mysql = require('./mysql-util');
var async = require('async');
//allowing dates to be passed to the queries through a function, it kind of acts like 
//prepared statements. As there is no direct support for P.S. in node-mysql yet

var getQuery1 = function(date) {
    return 'SELECT DATE_FORMAT(created, "%H:%i") as created ,count(*) as `count` FROM `blah` WHERE `type_id`=1 AND created>="' + date + ' 00:00:00" AND created<="' + date + ' 23:59:59" GROUP BY day(created) ,hour(created), minute(created) ORDER BY day(created) ,hour(created), minute(created)';
};
var getQuery2 = function(date) {
    return 'SELECT DATE_FORMAT(created, "%H:%i") as created, count(*) as `blah` FROM `tti_hit` WHERE created>="' + date + ' 00:00:00" and created<="' + date + ' 23:59:59" GROUP BY day(created) ,hour(created), minute(created) ORDER by day(created),hour(created), minute(created)';
}



exports.Query = function(date, dateold, res) {
    async.parallel({
            clicksQuery1: function(cb) {
                mysql.Query1(getQuery(date), function(err, rows, fields) {
                    console.log("entering countQuery callback");
                    if (err) {
                        cb(err);
                        return;
                    }
                    cb(null, rows);
                    return;
                }, date, 'query1');
            },
            clicksQuery2: function(cb) {
                mysql.Query(getQuery2(dateold), function(err, rows, fields) {
                    console.log("entering countQuery callback");
                    if (err) {
                        cb(err);
                        return;
                    }
                    cb(null, rows);
                    
                    return;
                }, dateold, 'query2');
            }

        },
        //call back function after parallel execution of queries is done

        function(err, sqlresults) {
            // results is now equals to: {countQuery: [], postbackQuery: []}
            console.log("entering async parallel callback");
            if (err) {
                throw err;
            }

            var results = [];
            var query1 = sqlresults.Query1;
            var query2 = sqlresults.Query2;
            // var postbacks = sqlresults.postbacksQuery;
            var length = clicks.length;
            var i = 0,
                result;
            console.log("\n \n\nconsolidated array length: " + length);
            for (i = 0; i < length; i++) {
                result = {};
                result.query1 = query1[i].created;
                result.query1count = query1[i].count;
                result.query2 = query2[i].count;
                results.push(result);

            }
            console.log("consolidated results: " + JSON.stringify(results));
            //converting the data to csv for producing a leaner packet
            // json2csv({
            //     data: results,
            //     fields: ['hour', 'count', 'postback']
            // }, function(err, csv) {
            //     if (err) console.log(err);
            //     console.log(csv);
            //     app.set('results', csv);
            // });
            // app.set('results', JSON.stringify(results));
            res.contentType('json');
            res.send(
                results
            );
        });

}



}
