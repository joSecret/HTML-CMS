/**
 * @file
 * Description.
*/

'use strict';
// Variables!
const themeTitle       = 'JoAM';
const rootFolder       = './'
const sourcePath       = rootFolder + 'src/';
const distPath         = rootFolder + 'dist/';


// Load plugins!
const gulp         = require('gulp');
const sass         = require('gulp-sass');
const twig         = require('gulp-twig');
const image        = require('gulp-image');
const plumber      = require('gulp-plumber');
const purgecss     = require('gulp-purgecss')
const browsersync  = require('browser-sync').create();
const sourcemaps   = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const strip        = require('gulp-strip-comments');
const minify       = require('gulp-minify');
const postcss      = require('gulp-postcss');

// BrowserSync!
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: rootFolder + 'dist'
    }
  });
  done();
}

function twigHtml() {
  return gulp
    .src(sourcePath + 'twig/*.twig')
    .pipe(twig({
      data: {
        tTitle: themeTitle,
      }
    }))
    .pipe(gulp.dest(distPath))
    .pipe(browsersync.stream())
}

function css() {
  return gulp
    .src(sourcePath + 'scss/**/*.scss')
    .on('error', catchErr)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' }, {errLogToConsole: true}))
    .on('error', catchErr)
    .pipe(postcss([autoprefixer]))
    .pipe(sourcemaps.write('map'))
    .pipe(gulp.dest(distPath + 'css'))
    .pipe(browsersync.stream())
}

function cssMin() {
  return gulp
    .src(sourcePath + 'scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(postcss([autoprefixer]))
    .pipe(
      purgecss({
        content: [rootFolder + 'src/**/*.twig']
      })
    )
    .pipe(gulp.dest(distPath + 'css'))
}

// Transpile,minify scripts!
function scripts() {
  return gulp
    .src([sourcePath + 'js/**/*'])
    .pipe(minify({noSource: true}))
    .pipe(gulp.dest(distPath + 'js'))
    .pipe(browsersync.stream())
}

// images
function imageMin() {
  return gulp
    .src(rootFolder + 'assets/*')
    .pipe(image())
    .pipe(gulp.dest(distPath + 'assets/'));
}

// Watch files!
function watchFilesHtml() {
  gulp.watch(sourcePath + 'scss/**/*', css);
  gulp.watch(sourcePath + 'js/**/*', scripts);
  gulp.watch(sourcePath + 'twig/**/*.twig', twigHtml);
}

const watchHtml = gulp.parallel(watchFilesHtml, browserSync);

// Define complex tasks!
const build = gulp.series(gulp.parallel(cssMin, scripts, imageMin, twigHtml));

function catchErr(e) {
  console.log(e);
  this.emit('end');
}

// Export tasks!
exports.watch = watchHtml;
exports.default = build;
