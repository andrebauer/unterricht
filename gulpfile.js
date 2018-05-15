var gulp = require('gulp');
var exec = require('child_process').exec;
var del = require('del')
var gulpCopy = require('gulp-copy');

var sourcefiles = [ 'docs/**/*',
		    'stylesheets/**/*',
		    'src/**/*',
		    'images/**/*',
		    'partials/**/*' ];

// var buildDir = '_build/'

// var htmldocs_ =
//     buildDir + 'docs/*/*/*.adoc ' +
//     buildDir + 'docs/*/*.adoc ' +
//     buildDir + 'docs/*.adoc '

// var pdfdocs_ =
//     buildDir + 'docs/*/*/*.adoc ' +
//     buildDir + 'docs/*/*.adoc '

// var slides_ =
//     buildDir + 'docs/*/*/slides/*.adoc '

let build_dir = '_build/'

let pdf_paths = ['docs/*/*/*.adoc',
		 'docs/*/*.adoc']

let html_paths = pdf_paths.concat('docs/*.adoc');

let slide_paths = ['docs/*/*/slides/*.adoc']

let map_prefix = (prefix) => (arr) =>
    arr.map((x) => prefix + x);

let map_suffix = (suffix) => (arr) =>
    arr.map((x) => x + suffix);

let map_build = (arr) => 
    (map_suffix (' ') (map_prefix (build_dir) (arr))).join(' ');

let html_docs = map_build (html_paths);

let pdf_docs = map_build (pdf_paths);

let slide_docs = map_build (slide_paths);

var stylesheetHtml5Dir =
    'stylesheets/html5/ '

var stylesheetHtml5 =
    // 'asciidoctor.css '
    'ovm.css '
    
var verbose = ''

if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    });
  };
}

// copies source files to _build
gulp.task('prebuild', function() {
    return gulp
	.src(sourcefiles)
	.pipe(gulpCopy(build_dir))
});

// copies source files to _build
gulp.task('cp_stylesheet', function() {
    return gulp
	.src(stylesheetHtml5Dir + stylesheetHtml5)
	.pipe(gulpCopy(build_dir))
});

// builds html docs
gulp.task('build:html', function(cb) {
    exec(String.format(
	"asciidoctor -r asciidoctor-diagram {0} \
         --base-dir={1} -b html5 --safe-mode=safe {2}",
	verbose, build_dir, html_docs),
	 function(err, stdout, stderr) {
	     console.log(stdout);
	     console.log(stderr);
	     cb(err);
	 });
})

//'-a stylesdir=/ ' + // stylesheetHtml5Dir +
//'-a stylesheet' + stylesheetHtml5 +
/* -a data-uri -a allow-uri-read ' + */


// builds html docs
gulp.task('build:html:old', function(cb) {
    exec('asciidoctor -r asciidoctor-diagram ' + verbose +
	 '--base-dir=' + build_dir + ' ' +
	 '-b html5 ' +
	 '--safe-mode=safe ' +
	 //'-a stylesdir=/ ' + // stylesheetHtml5Dir +
	 //'-a stylesheet' + stylesheetHtml5 +
	 /* -a data-uri -a allow-uri-read ' + */
	 html_docs,
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
    exec(String.format(
  	 "asciidoctor -r asciidoctor-diagram -r asciidoctor-pdf {0} \
          --base-dir={1} -b pdf --safe-mode=safe \
          -a pdf-style={2} -a allow-uri-read {3} {4}",
	 verbose, build_dir, 'stylesheets/pdf/default-theme.yml',
	 html_docs, slide_docs),
	 function(err, stdout, stderr) {
	     console.log(stdout);
	     console.log(stderr);
	     cb(err);
	 });
})


// builds pdf docs
gulp.task('build:pdf:old', function(cb) {
    exec('asciidoctor -r asciidoctor-diagram -r asciidoctor-pdf ' + verbose +
	 '--base-dir=' + build_dir + ' ' +
	 '-b pdf ' +
	 '--safe-mode=safe ' +
	 '-a pdf-style=' + 'stylesheets/pdf/default-theme.yml ' +
	 /* -a data-uri */
	 '-a allow-uri-read ' + pdf_docs + slide_docs,
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
    exec(String.format(
  	 "asciidoctor-revealjs -a {0} \
         -r asciidoctor-diagram {1} \
         --base-dir={2} --safe-mode=safe -a notitle! {3}",
	 'revealjsdir=https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.3.0',
	 verbose, build_dir, slide_docs),
	 function(err, stdout, stderr) {
	     console.log(stdout);
	     console.log(stderr);
	     cb(err);
	 });
})

// builds slides
gulp.task('build:slides:old', function(cb) {
    exec('asciidoctor-revealjs -a ' +
	 'revealjsdir=https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.3.0 ' +
	 '-r asciidoctor-diagram ' + verbose +
	 '--base-dir=' + build_dir + ' ' +
	 '--safe-mode=safe ' +
	 /* '-a data-uri -a allow-uri-read */
	 '-a notitle! ' + slide_docs,
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
    
