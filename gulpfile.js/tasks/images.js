var config      = require('../config')
if(!config.tasks.images) return

var browserSync = require('browser-sync')
var changed     = require('gulp-changed')
var gulp        = require('gulp')
var imagemin    = require('gulp-imagemin')
var path        = require('path')
var pngquant = require('imagemin-pngquant');

var paths = {
  src: path.join(config.root.src, config.tasks.images.src, '/**'),
  dest: path.join(config.root.dest, config.tasks.images.dest)
}
gulp.task('images', function() {
  return gulp.src([paths.src])
    //.pipe(changed(paths.dest)) // Ignore unchanged files
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [
          {removeViewBox: false},
          {cleanupIDs: false}
      ],
      use: [pngquant()]
    })) // Optimize
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.reload({stream:true}))
});
