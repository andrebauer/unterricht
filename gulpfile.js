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
    exec('asciidoctor -r asciidoctor-diagram -r asciidoctor-pdf ' +
	 '-b html _build/docs/*/*/*.adoc _build/docs/*/*.adoc ' +
	 '_build/docs/*.adoc',
	 function(err, stdout, stderr) {
	     console.log(stdout);
	     console.log(stderr);
	     cb(err);
	 });
})

gulp.task('build:pdf', function(cb) {
    exec('asciidoctor -r asciidoctor-diagram -r asciidoctor-pdf ' +
	 '-b pdf -a allow-uri-read _build/docs/*/*/*.adoc ' +
	 '_build/docs/*/*/slides/*.adoc',
	 function(err, stdout, stderr) {
	     console.log(stdout);
	     console.log(stderr);
	     cb(err);
	 });
})

gulp.task('build:slides', function(cb) {
    exec('asciidoctor-revealjs -a ' +
	 'revealjsdir=https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.3.0 ' +
	 '-r asciidoctor-diagram _build/docs/*/*/slides/*.adoc',
	 function(err, stdout, stderr) {
	     console.log(stdout);
	     console.log(stderr);
	     cb(err);
	 });
})

gulp.task('build', ['prebuild', 'build:html', 'build:pdf', 'build:slides']);

/* Clean builded files
============================== */
gulp.task('clean', function(cb) {
    del(['_build/**/*', '_build'], cb)
});
	
    //return gulp.src('_build/**/*.adoc')
    
