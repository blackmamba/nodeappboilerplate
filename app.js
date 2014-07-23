/*global require, console, app, __dirname*/
'use strict';
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var async = require('async');
ejs.open = '{{';
ejs.close = '}}';

var json2csv = require('json2csv');
var routes = require('./routes/index');
var mysql = require('./db/mysql');
var moment = require('moment');
//query db and store results
//@param date: '2014-06-12' - expected format


function clicksQuery(date, dateover, res) {
    async.parallel({
            clicksQuery: function(cb) {
                mysql.clicksQuery(function(err, rows, fields) {
                    console.log("entering countQuery callback");
                    if (err) {
                        cb(err);
                        return;
                    }
                    cb(null, rows);
                    // console.log("results: " + JSON.stringify(rows));


                    //console.log("clicks: " + JSON.stringify(mysql.data.clicks));
                    app.set('clicks', mysql.data.clicks);
                    return;
                }, date, 'clicks');
            },
            clicksQueryOver: function(cb) {
                    mysql.clicksQuery(function(err, rows, fields) {
                        console.log("entering countQuery callback");
                        if (err) {
                            cb(err);
                            return;
                        }
                        cb(null, rows);
                        // console.log("results: " + JSON.stringify(rows));

                        // console.log('******************************************************');
                        // console.log('******************************************************');
                        // console.log("clicks: " + JSON.stringify(mysql.data.clicksover));
                        // console.log('******************************************************');
                        // console.log('******************************************************');
                        app.set('clicksover', mysql.data.clicksover);
                        return;
                    }, dateover, 'clicksover');
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
            var clicks = sqlresults.clicksQuery;
            var clicksOver = sqlresults.clicksQueryOver;
            // var postbacks = sqlresults.postbacksQuery;
            var length = clicks.length;
            var i = 0,
                result;
            console.log("\n \n\nconsolidated array length: " + length);
            for (i = 0; i < length; i++) {
                result = {};
                // result.hour = clicks[i].hour;
                // result.minute = clicks[i].minute;
                result.created = clicks[i].created;
                result.clicks = clicks[i].count;
                result.clicksover = clicksOver[i].count;
                // result.postback = postbacks[i].postback;
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
            app.set('results', JSON.stringify(results));
            res.contentType('json');
            res.send(
                results
            );
        });

}




function postbacksQuery(date, dateover, res) {
    async.parallel({
            postbacksQuery: function(cb) {
                mysql.postbacksQuery(function(err, rows, fields) {
                    console.log("entering countQuery callback");
                    if (err) {
                        cb(err);
                        return;
                    }
                    cb(null, rows);
                    // console.log("results: " + JSON.stringify(rows));


                    //console.log("clicks: " + JSON.stringify(mysql.data.clicks));
                    // app.set('postbacks', mysql.data.clicks);
                    return;
                }, date, 'postbacks');
            },
            postbacksQueryOver: function(cb) {
                    mysql.postbacksQuery(function(err, rows, fields) {
                        console.log("entering countQuery callback");
                        if (err) {
                            cb(err);
                            return;
                        }
                        cb(null, rows);
                        // console.log("results: " + JSON.stringify(rows));

                        // console.log('******************************************************');
                        // console.log('******************************************************');
                        // console.log("clicks: " + JSON.stringify(mysql.data.clicksover));
                        // console.log('******************************************************');
                        // console.log('******************************************************');
                        // app.set('postbacks', mysql.data.clicksover);
                        return;
                    }, dateover, 'postbacksover');
                }
                // ,
                // postbacksQuery: function(cb) {
                //     mysql.postbackQuery(function(err, rows, fields) {
                //         console.log("entering postbackQuery callback");
                //         if (err) {
                //             cb(err);
                //             return;
                //         }
                //         cb(null, rows);
                //         // console.log("results: " + JSON.stringify(rows));
                //         //console.log("postbacks: " + JSON.stringify(mysql.data.clicks));
                //         app.set('postbacks', mysql.data.postbacks);
                //         mysql.connection.end();
                //         return;
                //     }, '2014-06-19', '2014-06-12')
                // }
        },
        //call back function after parallel execution of queries is done

        function(err, sqlresults) {
            // results is now equals to: {countQuery: [], postbackQuery: []}
            console.log("entering async parallel callback");
            if (err) {
                throw err;
            }

            var results = [];
            var postbacks = sqlresults.postbacksQuery;
            var postbacksOver = sqlresults.postbacksQueryOver;
            // var postbacks = sqlresults.postbacksQuery;
            var length = postbacks.length;
            var i = 0,
                result;
            console.log("\n \n\nconsolidated array length: " + length);
            for (i = 0; i < length; i++) {
                result = {};
                // result.hour = clicks[i].hour;
                // result.minute = clicks[i].minute;
                result.created = postbacks[i].created;
                result.postbacks = postbacks[i].postback;
                result.postbacksover = postbacksOver[i].postback;
                // result.postback = postbacks[i].postback;
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
            app.set('results', JSON.stringify(results));
            res.contentType('json');
            res.send(
                results
            );
        });

}

var app = express();
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
// app.engine('.ejs', ejs.__express);
// app.set('view engine', 'ejs');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use ('/', function(req, res, next){
//     res.render('index.ejs', {
//             title: 'blah',
//             clicks: app.get('clicks')
//         });

// });

app.use('/', routes);
//respond to the ajax request 
app.use('/clicks/:date', function(req, res, next) {
    var date = req.param('date');
    //var results = fetchData(date);
    console.log("date received: " + req.param('date'));
    var dt = moment(parseInt(date, 10));
    console.log("dt.isValid(): " + dt.isValid());
    if (dt.isValid()) {

        clicksQuery(dt.format("YYYY-MM-DD"), dt.subtract('days', 7).format("YYYY-MM-DD"), res);
        console.log("date: " + dt.format("YYYY-MM-DD"));
        // console.log("results: " + results);
        return;
    }
    //passing the response object also, and the response will be sent from the async method callback

    console.log("invalid date: " + dt.invalidAt());
    res.contentType('json');
    res.send({
        result: 'invalid date'
    });
    return;
});

app.use('/postbacks/:date', function(req, res, next) {
    var date = req.param('date');
    //var results = fetchData(date);
    console.log("date received: " + req.param('date'));
    var dt = moment(parseInt(date, 10));
    console.log("dt.isValid(): " + dt.isValid());
    if (dt.isValid()) {

        postbacksQuery(dt.format("YYYY-MM-DD"), dt.subtract('days', 7).format("YYYY-MM-DD"), res);
        console.log("date: " + dt.format("YYYY-MM-DD"));
        // console.log("results: " + results);
        return;
    }
    //passing the response object also, and the response will be sent from the async method callback

    console.log("invalid date: " + dt.invalidAt());
    res.contentType('json');
    res.send({
        result: 'invalid date'
    });
    return;
});




/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    // res.setHeader('Cache-Control', 'public, max-age=3600')
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error.ejs', {
//             message: 'Error:oops something went wrong',
//             error: err.message
//         });
//     });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: 'oops something went wrong',
//         error: err
//     });
// });


// module.exports = app;
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
