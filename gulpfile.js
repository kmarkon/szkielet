const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const concat = require('gulp-concat');
// const uglify = require('gulp-uglify');
// const cssnano = require('gulp-cssnano');
// const imagemin = require('gulp-imagemin');

// DEVELOPMENT
gulp.task('dev', ['html', 'js', 'sass', 'fonts', 'images', 'serve']);

// BUILD
gulp.task('build', ['html', 'js', 'sass', 'assets']);

// TASKS
gulp.task('html', () => gulp.src('./src/*.html').pipe(gulp.dest('./build')));

gulp.task('js', () =>
  gulp
    .src([
      './node_modules/jquery/dist/jquery.js',
      './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
      // './node_modules/slick-carousel/slick/slick.js',
      // './node_modules/flip/dist/jquery.flip.js',
      './src/index.js',
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('index.js'))
    // .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./build')));

gulp.task('sass', () => {
  const autoprefixerConfig = {
    browsers: [
      'Chrome >= 56',
      'Safari >= 10',
      'Opera >= 45',
      'Explorer >= 11',
      'Firefox >= 51',
      'Edge >= 12',
    ],
  };

  return gulp
    .src(['./src/styles.scss', './src/scss/**/*.scss'])
    .pipe(
      plumber(function(err) {
        notify({
          title: 'Styles Error',
          message: err.message,
        }).write(err);
        this.emit('end');
      }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer(autoprefixerConfig))
    // .pipe(cssnano())
    .pipe(sourcemaps.write('./build/maps'))
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.stream());
});

gulp.task('fonts', () =>
  gulp
    .src('./src/assets/fonts/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest('./build/assets/fonts/')));

gulp.task('images', () =>
  gulp
    .src('./src/assets/img/*.{png, jpg, jpeg, svg}')
    // .pipe(imagemin([
      // imagemin.optipng({optimizationLevel: 4}),
      
// ]))
    .pipe(gulp.dest('./build/assets/img')));

gulp.task('assets', () =>
  gulp.src('./src/assets/**/*').pipe(gulp.dest('./build/assets')));

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: 'build'
    }
    // proxy: 'http://0.0.0.0:8000',
  });

  gulp.watch('./src/assets/fonts/*.{eot,svg,ttf,woff,woff2}', ['fonts']);
  gulp.watch('./src/assets/img/*.{png, jpg, jpeg, svg}', ['images']);
  gulp.watch(['./src/scss/**/*.scss', './src/styles.scss'], ['sass']);
  gulp.watch('./src/*.html', ['html']);
  gulp.watch('./src/index.js', ['js']);
  gulp.watch('./build/**/*.{html, js}').on('change', browserSync.reload);
  // gulp.watch('./partials/*.twig').on('change', browserSync.reload);
});
