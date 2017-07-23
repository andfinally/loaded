'use strict';

var gulp = require('gulp'),
	babel = require('gulp-babel'),
	es = require('event-stream'),
	livereload = require('gulp-livereload'),
	runSequence = require('run-sequence'),
	rename = require('gulp-rename');

var riseError = function(err) {
	console.log(err.toString());
	this.emit('end');
};

gulp.task('default', function() {
	runSequence('babel', 'watch');
});

gulp.task('babel', function() {
	return es.concat(
		gulp.src('*.es')
			.pipe(babel({presets: ['es2015']}))
			.on('error', riseError)
			.pipe(rename('loaded.js'))
			.pipe(gulp.dest(''))
	).pipe(livereload());
});

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch('*.es', ['babel']);
});
