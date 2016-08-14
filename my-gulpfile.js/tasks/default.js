var gulp            = require('gulp');
var gulpSequence    = require('gulp-sequence');
var getEnabledTasks = require('../lib/getEnabledTasks');

/**
 *  默认启动的任务
 */
gulp.task('default', function(cb) {
  //执行这是好的任务
  var tasks = getEnabledTasks('watch');
  //按照设定好的执行顺序执行任务
  gulpSequence('clean', tasks.assetTasks, tasks.codeTasks, 'watch', cb)
});