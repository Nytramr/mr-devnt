var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var browserSync = require('browser-sync').create();

//Erase dist folder's content
gulp.task('clean', function(){
  return gulp.src(['dist/*'], {read:false})
  .pipe(clean());
});

//Copy files to dist
gulp.task('copy', ['clean'], function() {
  return gulp.src('src/*.js')
    .pipe(gulp.dest('dist/'));
});

//Uglify
gulp.task('compress', ['clean'], function() {
  return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('dist'));
});

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
      port: 3010,
      server: {
        baseDir: "./"
      },
      startPath: "/examples"
    });
});

gulp.task('build', ['clean', 'copy', 'compress']);

gulp.task('default', ['browser-sync']);
