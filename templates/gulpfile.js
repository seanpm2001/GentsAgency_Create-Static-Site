const gulp = require('gulp');
const config = require('./gulp/config');
const Registry = require('@gentsagency/gulp-registry');

const tasks = new Registry(config);

gulp.registry(tasks);