var gulp   = require('gulp');
var del    = require('del');
var config = require('../config');
var path   = require('path');
var gutil  = require("gulp-util");

gulp.task('clean', function (cb) {
  //文件选择是root.dest文件夹和根目录下的rev.manifest.json也就是hash列表文件
  var files = [ path.join(config.root.dest, 'rev-manifest.json') ];
  //把每个任务中的dest值找到文件夹路径
  for(var key in config.tasks) {
    var task = config.tasks[key];
    if(task.dest) {
      var glob = '**/*' + (task.extensions ? ('.{' + task.extensions.join(',') + ',map}') : '');
      var glob2 = '*' + (task.extensions ? ('.{' + task.extensions.join(',') + ',map}') : '');
      //最后根据config任务中的dest和后缀名生成文件夹的名字
      files.push(path.join(config.root.dest, task.dest, glob));
      files.push(path.join(config.root.dest, task.dest, glob2));
    }
  }
  

  // Don't touch node_modules or source files!
  files.push('!node_modules/**/*');
  files.push('!' + path.join(config.root.src, '/**/*'));
  del(files).then(function (paths) {
    // console.log(paths)
    cb()
  })
})