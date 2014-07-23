/*global window, define, Backbone, $, _, d3, lax, console*/
window.lax = window.lax || {};
define([
    // These are path alias that we configured in our bootstrap
    'jquery',
    'underscore',
    'backbone',
    'DateTimePickerView'
], function($, _, Backbone, DateTimePickerView) {
    'use strict';

    // var Click = Backbone.Model.extend({
    //     defaults: {
    //         created: "",
    //         clicks: "",
    //         clicksover:""
    //     },
    //     initialize: function() {
    //         console.log("Music is the answer");
    //     }
    // });

    var Clicks = Backbone.Collection.extend({
        // no need for a model as its one way communication
        // model: Click,
        context: '',
        initialize: function(context) {
            // console.log("lax: " + lax);
            // console.log("lax.datepicker: " + lax.datepicker);
            this.context = context || 'clicks';
            var today = new Date();
            this.date = today.valueOf();
            $("#datepicker").on("dp.change", $.proxy(this.setDate, this));
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
        url: function() {
            return '/' + this.getContext() + '/' + this.date;
        },
        setDate: function(e) {
            // var tar = e.target;
            this.date = e.date;
            this.fetch({
                reset: true
            });
        }
    });


    return Collection;
    // What we return here will be used by other modules
});
