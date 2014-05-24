// Karma configuration
// Generated on Thu May 01 2014 18:28:30 GMT+0300 (FLE Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [			
			"e2e/bower_components/underscore/underscore.js",
			"e2e/bower_components/jquery/dist/jquery.js",
			"e2e/bower_components/angular/angular.js",			
			"unit/lib/angular-mocks.js",
			"src/shims/*.js",
			"src/ValidatorsProvider.js",
			"src/NgDynamicValidator.js",
			"unit/*.js"
    ],


    // list of files to exclude
    exclude: [
		'*.intellisense.*',
		'*.min.*.js',
		'*.map'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['html','progress'],
	
	htmlReporter: {
      outputDir: 'unit/reports'
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome','Firefox','IE'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
