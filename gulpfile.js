var gulp = require('gulp');
var exec = require('child_process').exec;
var del = require('del')
var gulpCopy = require('gulp-copy');

var sourcefiles = [ 'docs/**/*', 'stylesheets/**/*', 'src/**/*', 'images/**/*' ];

var buildDir = '_build/'

var htmldocs =
    buildDir + 'docs/*/*/*.adoc ' +
    buildDir + 'docs/*/*.adoc ' +
    buildDir + 'docs/*.adoc '

var pdfdocs =
    buildDir + 'docs/*/*/*.adoc ' +
    buildDir + 'docs/*/*.adoc '
    
var slides =
    buildDir + 'docs/*/*/slides/*.adoc '

var stylesheetHtml5Dir =
    'stylesheets/html5/ '

var stylesheetHtml5 =
    // 'asciidoctor.css '
    'ovm.css '
    
var verbose = ''

// copies source files to _build
gulp.task('prebuild', function() {
    return gulp
	.src(sourcefiles)
	.pipe(gulpCopy(buildDir))
});

// copies source files to _build
gulp.task('cp_stylesheet', function() {
    return gulp
	.src(stylesheetHtml5Dir + stylesheetHtml5)
	.pipe(gulpCopy(buildDir))
});

// builds html docs
gulp.task('build:html', function(cb) {
    exec('asciidoctor -r asciidoctor-diagram ' + verbose +
	 '--base-dir=' + buildDir + ' ' +
	 '-b html5 ' +
	 '--safe-mode=safe ' +
	 //'-a stylesdir=/ ' + // stylesheetHtml5Dir +
	 //'-a stylesheet' + stylesheetHtml5 +
	 /* -a data-uri -a allow-uri-read ' + */
	 htmldocs,
	 function(err, stdout, stderr) {
	     console.log(stdout);
	     console.log(stderr);
	     cb(err);
	 });
})

/*
http://asciidoctor.org/docs/user-manual/#applying-a-stylesheet

$ asciidoctor -a stylesheet=colony.css -a stylesdir=../stylesheets mysample.adoc
*/


// builds pdf docs
gulp.task('build:pdf', function(cb) {
    exec('asciidoctor -r asciidoctor-diagram -r asciidoctor-pdf ' + verbose +
	 '--base-dir=' + buildDir + ' ' +
	 '-b pdf ' +
	 '--safe-mode=safe ' +
	 '-a pdf-style=' + 'stylesheets/pdf/default-theme.yml ' +
	 /* -a data-uri */
	 '-a allow-uri-read ' + pdfdocs + slides,
	 function(err, stdout, stderr) {
	     console.log(stdout);
	     console.log(stderr);
	     cb(err);
	 });
})

/*



Here’s how you’d load your theme when calling Asciidoctor PDF:

$ asciidoctor-pdf -a pdf-stylesdir=resources/themes -a pdf-style=basic -a pdf-fontsdir=resources/fonts

If all goes well, Asciidoctor PDF should run without an error or warning.
paperclip
	You only need to specify the pdf-fontsdir if you are using custom fonts in your theme.

You can skip setting the pdf-stylesdir attribute and just pass the absolute path of your theme file to the pdf-style attribute.

$ asciidoctor-pdf -a pdf-style=resources/themes/basic-theme.yml -a pdf-fontsdir=resources/fonts

However, in this case, image paths in your theme won’t be resolved properly.

Paths are resolved relative to the current directory. However, in the future, this may change so that paths are resolved relative to the base directory (typically the document’s directory). Therefore, it’s recommend that you specify absolute paths for now to future-proof your configuration.

$ asciidoctor-pdf -a pdf-stylesdir=/path/to/resources/themes -a pdf-style=basic -a pdf-fontsdir=/path/to/resources/fonts

As usual, you can also use build tools like Maven and Gradle to build a themed PDF. The only thing you need to add to an existing build is the attributes mentioned above.


*/

// builds slides
gulp.task('build:slides', function(cb) {
    exec('asciidoctor-revealjs -a ' +
	 'revealjsdir=https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.3.0 ' +
	 '-r asciidoctor-diagram ' + verbose +
	 '--base-dir=' + buildDir + ' ' +
	 '--safe-mode=safe ' +
	 /* '-a data-uri -a allow-uri-read */
	 '-a notitle! ' + slides,
	 function(err, stdout, stderr) {
	     console.log(stdout);
	     console.log(stderr);
	     cb(err);
	 });
})

gulp.task('build', ['prebuild', /* 'cp_stylesheet', */ 'build:html', 'build:pdf', 'build:slides']);

/* Clean builded files
============================== */
gulp.task('clean', function(cb) {
    del(['_build/**/*', '_build'], cb)
});
	
    //return gulp.src('_build/**/*.adoc')
    
