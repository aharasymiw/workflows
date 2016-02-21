var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var compass = require('gulp-compass');


// Instantiate an array variable with source paths, best practice
// Alternatively 'components/coffee/*.coffee'
var coffeeSources = ['components/coffee/tagline.coffee'];

// concat source files, listed in order of processing
var jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];

// Only needs one file, since Sass inports it's files itself
var sassSources =['components/sass/style.scss'];

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
    .pipe(gulp.dest('components/scripts'));
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
    .pipe(gulp.dest('builds/development/js'));
});

gulp.task('compass', function(){
  gulp.src(sassSources)
    //Compass can take a config object, as opposed to using a config.rb file for sass
    .pipe(compass({
      // Sass source directory
      sass: 'components/sass',
      // Image source directory
      image: 'builds/development/images',
      // style, 'expanded' for development, 'compressed' for production, can also be nested, compact http://goo.gl/6bCLQo
      style: 'expanded'
    })
      .on('error', gutil.log))
    .pipe(gulp.dest('builds/development/css'));
});

gulp.task('watch', function() {
  //runs in the background, whenever files change, tasks happen (files, [tasks])
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
});

gulp.task('default', ['coffee', 'js', 'compass']);
