/*global window, define, Backbone, $, _, d3, lax, console*/
window.lax = window.lax || {};
define([
    // These are path alias that we configured in our bootstrap
    'jquery', // lib/jquery/jquery
    'underscore', // lib/underscore/underscore
    'backbone', // lib/backbone/backbone
    'd3',
    'moment',
    'datetime',
    'DateTimePickerView',
    'Collection',
    'Graph',
    'Table',
    'SpinnerView',
    'bootstrap'
], function($, _, Backbone, d3, moment, datetime, DateTimePickerView, Clicks, Graph, Table,  SpinnerView, bootstrap) {
    'use strict';
    // Above we have passed in jQuery, Underscore and Backbone
    // They will not be accessible in the global scope
    var Table = '',
        Graph = '',
        clicks = '';
    console.log("main:lax" + lax);

    // console.log("main:datetimepicker" + lax.datepicker);
    return {
        initialize: function() {

            try {


                var Router = Backbone.Router.extend({
                        routes: {
                            '': 'clicks',
                            'postbacks': 'postbacks'
                        }
                    }),
                    router = new Router();
                lax.clicks = new Clicks();
                lax.table = new Table();
                lax.graph = new Graph();
                lax.datepicker = new DateTimePickerView();
                lax.spinner = new SpinnerView();
                router.on('route:clicks', function() {
                    console.log('We have loaded the home page');
                    lax.clicks.switchContext('clicks');
                    lax.Table.switchContext('clicks');
                    lax.Graph.switchContext('clicks');
                });

                router.on('route:postbacks', function() {
                    console.log('We have loaded the postbacks page');
                    lax.clicks.switchContext('postbacks');
                    lax.Table.switchContext('postbacks');
                    lax.Graph.switchContext('postbacks');
                });
                Backbone.history.start();
                $(document).on('click', 'ul.nav li a, ul.nav li', function(e) {
                    var $tar = $(e.target.parentNode);
                    $('ul.nav li').removeClass('active');
                    $tar.addClass('active');
                })

            } catch (e) {
                console.log("error: " + e.description);
            }   
        }


    };
    // What we return here will be used by other modules
});
