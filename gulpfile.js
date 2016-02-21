var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');

// Instantiate an array variable with source paths, best practice
// Alternatively 'components/coffee/*.coffee'
var coffeeSources = ['components/coffee/tagline.coffee']

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
