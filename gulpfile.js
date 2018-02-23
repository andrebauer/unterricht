var gulp = require('gulp');
var exec = require('child_process').exec;
var del = require('del')
var gulpCopy = require('gulp-copy');

var sourcefiles = [ 'docs/**/*' ];
var buildDir = '_build/'

var htmldocs =
    buildDir + 'docs/*/*/*.adoc ' +
    buildDir + 'docs/*/*.adoc ' +
    buildDir + 'docs/*.adoc '

var pdfdocs =
    buildDir + 'docs/*/*/*.adoc '
    
var slides =
    buildDir + 'docs/*/*/slides/*.adoc '

var verbose = ''

// copies source files to _build
gulp.task('prebuild', function() {
    return gulp
	.src(sourcefiles)
	.pipe(gulpCopy(buildDir))
});

// builds html docs
gulp.task('build:html', function(cb) {
    exec('asciidoctor -r asciidoctor-diagram ' + verbose +
	 '-b html -a data-uri -a allow-uri-read ' + htmldocs,
	 function(err, stdout, stderr) {
	     console.log(stdout);
	     console.log(stderr);
	     cb(err);
	 });
})

// builds pdf docs
gulp.task('build:pdf', function(cb) {
    exec('asciidoctor -r asciidoctor-diagram -r asciidoctor-pdf ' + verbose +
	 '-b pdf -a data-uri -a allow-uri-read ' + pdfdocs + slides,
	 function(err, stdout, stderr) {
	     console.log(stdout);
	     console.log(stderr);
	     cb(err);
	 });
})

// builds slides
gulp.task('build:slides', function(cb) {
    exec('asciidoctor-revealjs -a ' +
	 'revealjsdir=https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.3.0 ' +
	 '-r asciidoctor-diagram ' + verbose + '-v ' +
	 '-a data-uri -a allow-uri-read ' + slides,
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
    
