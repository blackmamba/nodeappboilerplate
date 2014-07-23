/*global window, define, Backbone, $, _, d3, lax, console*/
window.lax = window.lax || {};
define([
    // These are path alias that we configured in our bootstrap
    'jquery', // lib/jquery/jquery
    'underscore', // lib/underscore/underscore
    'backbone', // lib/backbone/backbone
    'Spinner',
], function($, _, Backbone, Spinner) {
    'use strict';
    // Above we have passed in jQuery, Underscore and Backbone
    // They will not be accessible in the global scope
    var spinner;
    var SpinnerView = Backbone.View.extend({
        el: '.spin',
        initialize: function() {
            var opts = {
                lines: 13, // The number of lines to draw
                length: 20, // The length of each line
                width: 10, // The line thickness
                radius: 30, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb or array of colors
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                // className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: '50%', // Top position relative to parent
                left: '50%' // Left position relative to parent
            };
            
            spinner = new Spinner(opts).spin(this.el);
            $("#datepicker").on("dp.change", $.proxy(this.spin, this));
            this.listenTo(lax.clicks, 'reset', this.stop);
            // this.listenTo(lax.clicks, 'reset', this.render, lax.clicks);
        },
        spin: function() {
            spinner.spin(this.el);

        },
        stop: function() {
            spinner.stop();

        }

    });

    return SpinnerView;
    // What we return here will be used by other modules
});
