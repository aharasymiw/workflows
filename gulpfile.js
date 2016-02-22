var gulp = require('gulp');
// Allows file system interactions, etc
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
// compiles all files into one file
var concat = require('gulp-concat');
// allows requireing of dependancies in js files
var browserify = require('gulp-browserify');
// Allows compliation of scss files to css
var compass = require('gulp-compass');
// allows live reload of page
var connect = require('gulp-connect');
// allows conditional statments in pipes
var gulpif = require('gulp-if');
// allows uglifying js
var uglify = require('gulp-uglify');
// allows minifying html
var minifyHTML = require('gulp-minify-html');
// allows minifying JSON
var jsonminify = require('gulp-jsonminify');
// allows image compression
var imagemin = require('gulp-imagemin');
// required for gulp-imagemin
var pngcrush = require('imagemin-pngcrush');


var env;
var coffeeSources;
var jsSources;
var sassSources;
var htmlSources;
var jsonSources;
var outputDir;
var sassStyle;

// set env to whatever the environment is defined as, or development if undefined
env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}

// Instantiate an array variable with source paths, best practice
// Alternatively 'components/coffee/*.coffee'
coffeeSources = ['components/coffee/tagline.coffee'];

// concat source files, listed in order of processing
jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];

// Only needs one file, since Sass inports it's files itself
sassSources =['components/sass/style.scss'];

// Sources for html files
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];


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
    //conditionally uglify, only if in production environment
    .pipe(gulpif(env ==='production', uglify()))
    //Save the output
    .pipe(gulp.dest(outputDir + 'js'))
    //reload the server
    .pipe(connect.reload());

});

gulp.task('compass', function() {
  gulp.src(sassSources)
    //Compass can take a config object, as opposed to using a config.rb file for sass
    .pipe(compass({
      // Sass source directory
      sass: 'components/sass',
      // Image source directory
      image: outputDir + 'images',
      // style, 'expanded' for development, 'compressed' for production, can also be nested, compact http://goo.gl/6bCLQo
      style: sassStyle
    })
      .on('error', gutil.log))
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  //runs in the background, whenever files change, tasks happen (files, [tasks])
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch('builds/development/*.html', ['html']);
  gulp.watch('builds/development/js/*.json', ['json']);
  gulp.watch('builds/development/images/**/*.*', ['images']);
});

gulp.task('connect', function() {
  connect.server({
    //location of application to server
    root: outputDir,
    livereload: true
  });
});

gulp.task('html', function() {
  gulp.src('builds/development/*.html')
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    .pipe(connect.reload());
});

gulp.task('images', function() {
  gulp.src('builds/development/images/**/*.*')
    .pipe(gulpif(env === 'production', imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngcrush()]
    })))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
    .pipe(connect.reload());
});

gulp.task('json', function() {
  gulp.src('builds/development/js/*.json')
    .pipe(gulpif(env === 'production', jsonminify()))
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
    .pipe(connect.reload());
});


gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'images', 'connect', 'watch']);
