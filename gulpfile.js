import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import {deleteAsync} from 'del';
import sync from "browser-sync";

// HTML

export const html = () => {
  return gulp.src('src/*.html')
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
    }))
    .pipe(gulp.dest('dist'))
    .pipe(sync.stream());
}

// Styles

export const styles = () => {
  return gulp.src('src/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('dist/css', { sourcemaps: '.' }))
    .pipe(sync.stream());
}

// Scripts

const scripts = () => {
  return gulp.src('src/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('dist/js'))
    .pipe(sync.stream());
}

// Images

const optimizeImages = () => {
  return gulp.src(['src/img/**/*.{jpg,png}', '!src/img/favicons/*.png'])
    .pipe(squoosh())
    .pipe(gulp.dest('dist/img'))
}

const copyImages = () => {
  return gulp.src(['src/img/**/*.{jpg,png}', '!src/img/favicons/*.png'])
    .pipe(gulp.dest('dist/img'))
}

// WebP

const createWebp = () => {
  return gulp.src(['src/img/**/*.{jpg,png}', '!src/img/favicons/*.png'])
    .pipe(
      squoosh({
        webp: {}
    }))
    .pipe(gulp.dest('dist/img'))
}

// SVG

const svg = () => {
  return gulp.src(['src/img/**/*.svg', '!src/img/svg/*.svg', '!src/img/favicons/*.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('dist/img'))
}

const sprite = () => {
  return gulp.src('src/img/svg/*.svg')
    .pipe(svgo())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('dist/img/svg'))
}

// Copy

const copy = (done) => {
  gulp.src([
    'src/fonts/*.{woff2,woff}',
    'src/img/favicons/*.{png,svg}',
    'src/*.ico',
    'src/*.webmanifest',
  ], {
    base: 'src'
  })
    .pipe(gulp.dest('dist'))
  done();
}

// Clean

const clean = () => {
  return deleteAsync('dist');
};

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'dist'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('src/sass/**/*.scss', gulp.series(styles));
  gulp.watch('src/js/script.js', gulp.series(scripts));
  gulp.watch('src/*.html', gulp.series(html)).on('change', sync.reload);
}

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebp
  ),
);

  // Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);

