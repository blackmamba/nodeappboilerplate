/*global require, console, app, __dirname*/
'use strict';
var express = require('express');
var compression = require('compression');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var TWSDAO = require('./db/transactionWsDAO')
ejs.open = '{{';
ejs.close = '}}';

// var json2csv = require('json2csv');
var routes = require('./routes/index');
var moment = require('moment');


var app = express();

app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.engine('.ejs', ejs.__express);
app.set('view engine', 'ejs');
//for gzipping
app.use(compression());
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//pick the resources from public folder.
app.use(express.static(path.join(__dirname, 'public')));
var oneDay = 86400;
if (app.get('env') === 'production') {
    app.use(express.static(path.join(__dirname, 'public/out'), { maxAge: oneDay }));
}

app.use('/', routes);
//respond to the ajax request 
app.use('/clicks/:date', function(req, res, next) {
    var date = req.param('date');
    //var results = fetchData(date);
    console.log("date received: " + req.param('date'));
    var dt = moment(parseInt(date, 10));
    console.log("dt.isValid(): " + dt.isValid());
    if (dt.isValid()) {

        TWSDAO.clicksQuery(dt.format("YYYY-MM-DD"), dt.subtract('days', 7).format("YYYY-MM-DD"), res);
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

        TWSDAO.postbacksQuery(dt.format("YYYY-MM-DD"), dt.subtract('days', 7).format("YYYY-MM-DD"), res);
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
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.ejs', {
            message: 'Error:oops something went wrong',
            error: err.message
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: 'Error:oops something went wrong',
        error: err
    });
});


// module.exports = app;
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
