/*global window, define, Backbone, $, _, d3, lax, console*/
window.lax = window.lax || {};
define([
    // These are path alias that we configured in our bootstrap
    'jquery', // lib/jquery/jquery
    'underscore', // lib/underscore/underscore
    'backbone', // lib/backbone/backbone
    'moment',
    'datetime'
], function($, _, Backbone, moment, datetime) {
    'use strict';
    // Above we have passed in jQuery, Underscore and Backbone
    // They will not be accessible in the global scope
    
    var DateTimePickerView = Backbone.View.extend({
        el: '#datepicker',
        initialize: function() {
            var dp = $('#datepicker').datetimepicker({
                pickTime: false,
            });
            var today = new Date();
            dp.data("DateTimePicker").setDate(today);
            dp.data("DateTimePicker").setMaxDate(today);
        }
        
    });

    return DateTimePickerView;
    // What we return here will be used by other modules
});


