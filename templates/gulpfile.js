const gulp = require('gulp');
const Registry = require('@gentsagency/gulp-registry');
const config = require('./gulp/config');

const tasks = new Registry(config);

gulp.registry(tasks);
