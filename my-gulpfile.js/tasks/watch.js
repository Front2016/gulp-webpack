var config = require('../config');
var gulp   = require('gulp');
var path   = require('path');
var watch  = require('gulp-watch');
var chmod        = require('gulp-chmod');
var handleErrors = require('../lib/handleErrors');

gulp.task('watch', ['server','browserSync'], function() {
    var watchableTasks = ['fonts', 'iconFont', 'images', 'svgSprite','jade', 'css'];
    //观察中的每一个任务
    watchableTasks.forEach(function(taskName) {
        var task = config.tasks[taskName];
        if(task) {
            //在设置好的文件中进行监测.
            var filePattern = path.join(config.root.src, task.src, '**/*.{' + task.extensions.join(',') + '}');
            //如果是监测的文件中有改动,那么久启动和这个文件相关的任务来执行
            watch(filePattern, function(){
                gulp.start(taskName);

                gulp.src( config.tasks.move.src + '/**' )
                    .on('error', handleErrors)
                    //.pipe(chmod(777))
                    .pipe( gulp.dest(config.tasks.move.dest) )

            })
        }
    })
})