var gulp = require('gulp');
var exec = require('child_process').exec;
var del = require('del')
var gulpCopy = require('gulp-copy');

var sourcefiles = [ 'docs/**/*' ];
var buildDir = '_build/'

// copies source files to _build
gulp.task('prebuild', function() {
    return gulp
	.src(sourcefiles)
	.pipe(gulpCopy(buildDir))
});

gulp.task('build:html', function(cb) {
    exec('asciidoctor -r asciidoctor-diagram -r asciidoctor-pdf -b html _build/docs/*/*/*.adoc _build/docs/*/*.adoc _build/docs/*.adoc', function(err, stdout, stderr) {
	console.log(stdout);
	console.log(stderr);
	cb(err);
    });
})


/* Clean builded files
============================== */
gulp.task('clean', function(cb) {
    del(['_build/**/*', '_build'], cb)
});
	
    //return gulp.src('_build/**/*.adoc')
    
