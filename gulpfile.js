var gulp = require('gulp');
var exec = require('child_process').exec;
var del = require('del')
var gulpCopy = require('gulp-copy');

var sourcefiles = [ 'docs/**/*',
		    'stylesheets/**/*',
		    'src/**/*',
		    'images/**/*',
		    'partials/**/*' ];

let build_dir = '_build/'

let pdf_paths = ['docs/*/*/*.adoc',
		 'docs/*/*.adoc']

let html_paths = pdf_paths.concat('docs/*.adoc');

let slide_paths = ['docs/*/*/slides/*.adoc']

let map_prefix = (prefix) => (arr) =>
    arr.map((x) => prefix + x);

let map_build = (arr) => 
    (map_prefix (build_dir) (arr)).join(' ');

let html_docs = map_build (html_paths);

let pdf_docs = map_build (pdf_paths);

let slide_docs = map_build (slide_paths);

/*
var stylesheet_html5_dir =
    'stylesheets/html5/'

var stylesheet_html5 =
    // 'asciidoctor.css'
    'ovm.css'
*/  
  
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
/* -a allow-uri-read */

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


/* 
-a pdf-fontsdir=/path/to/resources/fonts

For more informations about calling asciidoctor-pdf with theming see
https://github.com/asciidoctor/asciidoctor-pdf/blob/master/docs/theming-guide.adoc

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

// the main build task
gulp.task('build', ['prebuild', 'build:html', 'build:pdf', 'build:slides']);

// remove generated files 
gulp.task('clean', function(cb) {
    del(['_build/**/*', '_build'], cb)
});
	
    
