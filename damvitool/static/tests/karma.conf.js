module.exports = function (config) {
    config.set({
        /** application root path is relative to Karma configs */
        basePath: '../',
        /** used frameworks */
        frameworks: ['jasmine'],

        //@formatter:off
        files: [
        /** Use RequireJS to load libs & modules */
            {pattern: 'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.3/angular.js'},
            {pattern: 'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.3/angular-route.js'},
            {pattern: 'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.3/angular-resource.js'},
            {pattern: 'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.3/angular-mocks.js'},
            {pattern: 'lib/isomorphic/system/modules-debug/*.js'},
            {pattern: 'lib/isomorphic/skins/Enterprise/load_skin.js'},
            {pattern: 'lib/isomorphic/skins/Enterprise/**/!(load_skin.js)', included: false},
            {pattern: 'lib/js/ng-isc.js'},
            {pattern: 'app/**/*.js'},
            {pattern: 'tests/unit.spec.js'}
        ],
        //@formatter:on

        exclude: [],

        autoWatch: false,

        /* Continuous Integration mode. If true, Karma captures browsers, runs the tests and exits */
        singleRun: true,

        browsers: ['Chrome'],

        reporters: [],

        plugins: [
            'karma-firefox-launcher', 'karma-script-launcher', 'karma-chrome-launcher', 'karma-jasmine'
        ]
    });
};
