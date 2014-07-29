"use strict";
// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
// require.config({
    // baseUrl: './',
    // paths: {
    //     jquery: 'lib/jquery2.1.1-min',
    //     underscore: 'lib/underscore1.6.0-min',
    //     backbone: 'bower_components/backbone/backbone',
    //     bootstrap: 'bower_components/bootstrap/dist/js/bootstrap.min',
    //     d3: 'lib/d3',
    //     moment: 'bower_components/moment/min/moment.min',
    //     datetime: 'bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min',
    //     app: 'js/app/main',
    //     DateTimePickerView: 'js/views/DateTimePickerView',
    //     ClicksWowView: 'js/views/graphs/ClicksWowView',
    //     ClicksTableView: 'js/views/ClicksTableView',
    //     Clicks: 'js/collections/Clicks',
    //     Spinner: 'lib/spin.min',
    //     SpinnerView: 'js/views/SpinnerView'
    // }
// });

require([

  // Load our app module and pass it to our definition function
  'app'
], function (App) {
  // The "app" dependency is passed in as "App"
  App.initialize();
});