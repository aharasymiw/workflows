var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');


// Instantiate an array variable with source paths, best practice
// Alternatively 'components/coffee/*.coffee'
var coffeeSources = ['components/coffee/tagline.coffee']

// concat source files, listed in order of processing
var jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];

// A gulp task ('name', annonFunc(){})
// 'gulp coffee' runs it in term, ie 'gulp "taskName"'
gulp.task('coffee', function() {
  //specify where file(s) to be processed are
  //Can use a string literal, array of paths, or wildcard srouces
  gulp.src(coffeeSources)
    //.pipe it to another plugin, set options plugin({config})
    .pipe(coffee({bare: true})
      //coffee throws an error if problems, so catch for errors
      .on('error', gutil.log)) // this is all in pipe
    //.pipe results of coffee output to destination
    .pipe(gulp.dest('components/scripts'))
});

// Process js source files, concat them into script.js, place in development
gulp.task('js', function() {
  //List the input files
  gulp.src(jsSources)
    //Concat the files into one script.js file
    .pipe(concat('script.js'))
    //Attach dependencies that are required in JS files
    .pipe(browserify())
    //Save the output
    .pipe(gulp.dest('builds/development/js'))
});
