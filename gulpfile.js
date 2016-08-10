var gulp = require('gulp');
var minify = require('minify');

var jade = require('gulp-jade');

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
  return gulp.src('./src/page/*.jade')
    .pipe(jade({
      pretty: true
    })).pipe(gulp.dest('./dest'))
});