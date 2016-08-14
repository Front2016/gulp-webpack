var config       = require('../config')
var gulp         = require('gulp')
var gulpSequence = require('gulp-sequence')
var getEnabledTasks = require('../lib/getEnabledTasks');

var exec = require('child_process').exec;
var path = require('path');
var qrsync = path.join(__dirname,'../../qrsync');
var qiniu = path.join(__dirname,'../../qiniu.json');

gulp.task('publish',function(cb) {
  var tasks = getEnabledTasks('production');
  gulpSequence('clean', tasks.assetTasks, tasks.codeTasks, 'rev', 'server',function(){
    cb&&cb();
    var child = exec(qrsync + ' ' + qiniu,
      (error, stdout, stderr) => {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });
  })
})
