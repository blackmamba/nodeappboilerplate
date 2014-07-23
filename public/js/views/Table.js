/*global window, define, Backbone, $, _, d3, lax, console*/
window.lax = window.lax || {};
define([
    // These are path alias that we configured in our bootstrap
    'jquery', // lib/jquery/jquery
    'underscore', // lib/underscore/underscore
    'backbone', // lib/backbone/backbone
    'Collection'
], function($, _, Backbone) {
    'use strict';
    // Above we have passed in jQuery, Underscore and Backbone
    // They will not be accessible in the global scope

    // today = new Date();

    // clicks.setDate(today.toString());
    // lax.clicks = clicks;

    var ClicksTableView = Backbone.View.extend({
        el: '.table',
        context: '',

        initialize: function(context) {
            // this.render();
            this.context = context || 'clicks';
            this.listenTo(lax.clicks, 'reset', this.render);
            // clicks.fetch({
            //     reset: true
            // });
        },
        switchContext: function(context) {
            if (!context) {
                throw 'context required for setting a switching context';
            }
            this.context = context;
        },
        getContext: function() {
            return this.context;
        },
        render: function(clicks) {
            // var clicks = new Clicks();
            console.log("typeof clicks.models: " + typeof clicks.models);
            console.log("length clicks.models: " + clicks.models.length);
            console.log("clicks.models: " + typeof JSON.stringify(clicks.models));
            // console.log("clicks.models: " + JSON.stringify(clicks.models));
            // console.log("clicks.models: " + JSON.parse(clicks.models));

            var that = this,
                // var dt = date || new Date();
                // clicks.setDate(date);

                template = _.template($('#' + this.getContext() + '-list-template').html(), {
                    results: clicks.models
                });
            that.$el.html(template);

            // clicks.fetch({

            //     success: function(results) {
            //         var template = _.template($('#click-list-template').html(), {
            //             results: results
            //         })
            //         that.$el.html(template);
            //     }

            // });

        }
    });

    return Table;
    // What we return here will be used by other modules
});
