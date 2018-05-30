'use strict'

var gulp = require('gulp');
var exec = require('child_process').exec;
var del = require('del')
var gulpCopy = require('gulp-copy');

let docs = [ 'docs/**/*' ]

let stylesheets = [ 'stylesheets/**/*' ]

let images = [ 'images/**/*' ]

let resources = [ 'private/**/*',
		  'src/**/*',
		  'partials/**/*' ].concat(images);

let html_resources = stylesheets.concat(images);

let build_dir = '_build/'

let pub_dir = build_dir + 'unterricht/'

let publish_dir = '_publish/'

let private_path = build_dir + 'private/'

let pdf_paths = ['*/*/*.adoc',
		 '*/*.adoc']

let private_pdf_paths = [ '*/*/*.adoc' ];

let html_paths = pdf_paths.concat('*.adoc');

let slide_paths = ['*/*/slides/*.adoc']

let map_prefix = (prefix) => (arr) =>
    arr.map((x) => prefix + x);

let map_build = (arr) => 
    (map_prefix (pub_dir) (arr)).join(' ');

let html_docs = map_build (html_paths);

let pdf_docs = map_build (pdf_paths);

let slide_docs = map_build (slide_paths);

let private_pdf_docs = (map_prefix (private_path) (private_pdf_paths)).join(' ');

/*
var stylesheet_html5_dir =
    'stylesheets/html5/'

var stylesheet_html5 =
    // 'asciidoctor.css'
    'ovm.css'
*/  
  
var verbose = ''


/* 
Taken from
https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format 
*/
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

// copy doc files, strip docs/
gulp.task('copy:docs', function() {
    return gulp
	.src(docs)
	.pipe(gulpCopy(pub_dir, { prefix: 1} ))
});

// copy doc files, strip docs/
gulp.task('copy:html_resources', function() {
    return gulp
	.src(html_resources)
	.pipe(gulpCopy(pub_dir))
});


// copies source files to _build
gulp.task('copy:resources', function() {
    return gulp
	.src(resources)
	.pipe(gulpCopy(build_dir))
});

gulp.task('prebuild',[ 'copy:docs',
		       'copy:html_resources',
		       'copy:resources' ]);


// builds html docs
gulp.task('build:html', ['prebuild'], function(cb) {
    exec(String.format(
	"asciidoctor -r asciidoctor-diagram {0} \
         --base-dir={1} -b html5  -a allow-uri-read \
         --safe-mode=safe {2} {3}",
	verbose, build_dir, html_docs, private_pdf_docs),
	 function(err, stdout, stderr) {
	     console.log(stdout);
	     console.log(stderr);
	     cb(err);
	 });
})
/* -a allow-uri-read */

gulp.task('build:ad-basis-bsp-svg', ['prebuild', 'build:html'], function() {
    exec(String.format(
	"wkhtmltoimage -f svg {0}{1} {0}{2}",
	pub_dir + 'betriebssysteme/netzwerke-mit-virtualbox/',
	'asciidoc-basis-beispiel.html',
	'asciidoc-basis-beispiel.svg'),
	 function(err, stdout, stderr) {
	     console.log(stdout);
	     console.log(stderr);
	 });
})

gulp.task('copy:ad-basis-bsp-svg', ['build:ad-basis-bsp-svg'], function() {
    return gulp
	.src(pub_dir + 'betriebssysteme/netzwerke-mit-virtualbox/' +
	     'asciidoc-basis-beispiel.svg')
	.pipe(gulpCopy(build_dir + 'images/',{ prefix: 4 } ))
})

// builds pdf docs
gulp.task('build:pdf', ['prebuild', 'copy:ad-basis-bsp-svg'], function(cb) {
    exec(String.format(
  	 "asciidoctor -r asciidoctor-diagram -r asciidoctor-pdf {0} \
          --base-dir={1} -b pdf --safe-mode=safe \
          -a pdf-style={2} -a allow-uri-read {3} {4} {5}",
	 verbose, build_dir, 'stylesheets/pdf/default-theme.yml',
	html_docs, private_pdf_docs, slide_docs),
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
gulp.task('build:slides', ['prebuild'], function(cb) {
    exec(String.format(
  	 "asciidoctor-revealjs -a {0} \
         -r asciidoctor-diagram {1} \
         -a allow-uri-read \
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
gulp.task('build', ['prebuild',
		    'build:html',
		    'build:ad-basis-bsp-svg',
		    'copy:ad-basis-bsp-svg',
		    'build:pdf',
		    'build:slides']);

// remove generated files 
gulp.task('clean', function(cb) {
    del([build_dir + '**/*', build_dir], cb)
});

// Copy files from pub_dir
gulp.task('publish:copy', function() {
    return gulp
	.src([pub_dir] + '**/*')
	.pipe(gulpCopy(publish_dir, {prefix: 2}))
});

gulp.task('publish:clean', function(cb) {
    del([publish_dir + '**/*'], cb)
});
