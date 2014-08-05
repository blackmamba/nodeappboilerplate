gmodule.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // uglify: {
        //   options: {
        //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        //   },
        //   build: {
        //     src: 'src/<%= pkg.name %>.js',
        //     dest: 'build/<%= pkg.name %>.min.js'
        //   }
        // }
        requirejs: {
            compile: {
                options: {
                    baseUrl: './public',
                    fileExclusionRegExp: /^bower_components$/,

                    // mainConfigFile: './public/config.js',
                    // include: "./require.js",
                    paths: {
                        jquery: 'js/lib/jquery-2.1.1',
                        underscore: 'js/lib/underscore',
                        backbone: 'js/lib/backbone',
                        bootstrap: 'js/lib/bootstrap',
                        d3: 'js/lib/d3',
                        moment: 'js/lib/moment',
                        datetime: 'js/lib/bootstrap-datetimepicker',
                        app: 'js/app/main',
                        DateTimePickerView: 'js/views/DateTimePickerView',
                        graph: 'js/views/graphs/Graph',
                        table: 'js/views/Table',
                        Collection: 'js/collections/Clicks',
                        Spinner: 'js/lib/spin',
                        SpinnerView: 'js/views/SpinnerView',
                        require: 'require'
                    },
                    // name: 'config', // assumes a production build using almond
                    dir: 'public/out',
                    modules: [{
                        //First set up the common build layer.
                            //module names are relative to baseUrl
                            name: 'config'
                            //List common dependencies here. Only need to list
                            //top level dependencies, "include" will find
                            //nested dependencies.
                            // include: ['jquery',
                            //     'underscore',
                            //     'backbone'
                            // ]
                        }

                      

                    ],
                    optimizeCss: "standard",
                    // out: 'public/out/config.js',
                    // optimize: 'none'
                    // ,
                    // done: function(done, output) {
                    //     // var duplicates = require('rjs-build-analysis').duplicates(output);

                    //     // if (duplicates.length > 0) {
                    //     //     grunt.log.subhead('Duplicates found in requirejs build:');
                    //     //     grunt.log.warn(duplicates);
                    //     //     return done(new Error('r.js built duplicate modules, please check the excludes option.'));
                    //     // }
                    //     // JSON.Stringify(output);
                    //     done();
                    // }
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    // grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    // grunt.registerTask('default', ['uglify']);

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.registerTask('default', ['requirejs']);


};
