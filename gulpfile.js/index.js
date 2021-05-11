const gulp = require('gulp');
const $ = require('gulp-load-plugins')({ lazy: false });
const autoprefixer = require('autoprefixer');
const minimist = require('minimist');
const del = require('del');
const browserSync = require('browser-sync').create();
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const { envOptions } = require('./envOptions');

const options = minimist(process.argv.slice(2), envOptions);
// 現在開發狀態
console.log(`Current mode：${options.env}`);

function copyHTML() {
  return gulp
    .src(envOptions.html.src)
    .pipe($.plumber())
    .pipe($.if(options.env === 'prod', $.htmlmin({ collapseWhitespace: true }))) // 壓縮 HTML
    .pipe(gulp.dest(envOptions.html.path))
    .pipe(browserSync.reload({ stream: true })); // <= 注入更改內容
}

function sass() {
  const plugins = [autoprefixer()];
  return gulp
    .src(envOptions.style.src)
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss(plugins))
    .pipe($.if(options.env === 'dev', $.sourcemaps.write('.')))
    .pipe($.if(options.env === 'prod', $.cssnano()))
    .pipe(gulp.dest(envOptions.style.path))
    .pipe(browserSync.reload({ stream: true }));
}

function babel() {
  return browserify({
    entries: [envOptions.javascript.entries],
  })
    .transform(babelify, { presets: ['@babel/preset-env'] })
    .bundle()
    .pipe(source('all.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init())
    // .pipe($.concat(envOptions.javascript.concat))
    .pipe($.if(options.env === 'prod', $.uglify()))
    .pipe($.if(options.env === 'dev', $.sourcemaps.write('.')))
    .pipe(gulp.dest(envOptions.javascript.path))
    .pipe(browserSync.reload({ stream: true }));
}

function vendorJs() {
  const vendorSrc = envOptions.vendors.src;
  return gulp
    .src($.if(vendorSrc.length > 0, envOptions.vendors.src, '.'))
    .pipe($.concat(envOptions.vendors.concat))
    .pipe(gulp.dest(envOptions.vendors.path));
}

function copyImgs() {
  return gulp
    .src(envOptions.img.src)
    .pipe($.if(options.env === 'prod', $.image()))
    .pipe(gulp.dest(envOptions.img.path))
    .pipe(browserSync.reload({ stream: true }));
}

function browser() {
  browserSync.init({
    server: {
      baseDir: envOptions.browserDir,
    },
    port: 8080,
  });
}

function clean() {
  return del([envOptions.clean.src]);
}

function deploy() {
  return gulp.src(envOptions.deploySrc).pipe($.ghPages());
}

function watch() {
  gulp.watch(envOptions.html.src, gulp.series(copyHTML));
  gulp.watch(envOptions.style.src, gulp.series(sass));
  gulp.watch(envOptions.javascript.src, gulp.series(babel));
  gulp.watch(envOptions.img.src, gulp.series(copyImgs));
}

exports.clean = clean;
exports.deploy = deploy;
exports.default = gulp.series(
  clean,
  copyHTML,
  sass,
  babel,
  vendorJs,
  copyImgs,
  gulp.parallel(watch, browser),
);
exports.build = gulp.series(clean, copyHTML, sass, babel, vendorJs, copyImgs);
