/*global require*/

var gulp = require('gulp');
/** clean up temporary and target files */
var clean = require('gulp-clean');
/** JS code quality tool */
var jshint = require('gulp-jshint');
/** Generate complexity analysis reports with plato (https://github.com/es-analysis/plato) */
var plato = require('gulp-plato');
/** Display the size of your project */
var size = require('gulp-size');
/** Generate a TODO.md file from your javascript todos and fixmes */
var todo = require('gulp-todo');
/** A yuidoc plugin for Gulp */
var yuidoc = require("gulp-yuidoc");
/** Run Jasmine tests with minijasminenode (Jasmine 1.3) */
var jasmine = require('gulp-jasmine');
/** testing environment to developers */
var karma = require('gulp-karma');
//var coverage = require('gulp-coverage');
var protractor = require("gulp-protractor").protractor;
var webserver = require('gulp-webserver');

gulp.task('test_unit', function () {
    gulp.src(["damvitool/static/tests/e2e.js"])
        .pipe(karma({
            configFile: 'damvitool/static/tests/karma.conf.js',
            singleRun: true
        }))
        .on('error', function (e) {
            throw e;
        });
});

gulp.task('test_e2e', function () {
    var stream = gulp.src('damvitool/static').pipe(webserver())
        .on('end', function () {
            gulp.src(["damvitool/static/tests/e2e.js"])
                .pipe(protractor({
                    configFile: "damvitool/static/tests/protractor.conf.js",
                    args: ['--baseUrl', 'http://127.0.0.1:8000']
                }))
                .on('error', function (e) {
                    throw e;
                })
                .on('end', function () {
                    stream.emit('kill');
                });
        });
});

gulp.task('test', ['test_unit', 'test_e2e']);

///**
// * Clean up all not source directories.
// */
//gulp.task('clean', function () {
//    gulp.src(['build/js/', 'build/report/'], {read: false}).pipe(clean());
//});
//
///**
// * Generate YUIDoc. This gulp plugin is an early release, we should use Grunt for YUDoc.
// */
//gulp.task('yuidoc', function () {
//    gulp.src(['build/report/yuidoc'], {read: false}).pipe(clean());
//    gulp.src('ng-isc.js').pipe(yuidoc()).pipe(gulp.dest("build/report/yuidoc"));
//});
//
//
//gulp.task('plato', function () {
//    gulp.src('ng-isc.js').pipe(plato('build/report/plato', {
//        jshint:     {
//            options: {
//                strict: true
//            }
//        },
//        complexity: {
//            trycatch: true
//        }
//    }));
//});

gulp.task('default', ['test']);
