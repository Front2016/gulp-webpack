/**
 * Created by lio on 16/8/14.
 */
//var config      = require('../config');
//if(!config.tasks.fonts) return;
//
//var browserSync = require('browser-sync');
//var changed     = require('gulp-changed');
var gulp        = require('gulp');
var path        = require('path');
//
//var paths = {
//    src: path.join(config.root.src, config.tasks.fonts.src, '/**/*'),
//    dest: path.join(config.root.dest, config.tasks.fonts.dest)
//};
//
//gulp.task('fonts', function() {
//    return gulp.src(paths.src)
//        .pipe(changed(paths.dest)) // Ignore unchanged files
//        .pipe(gulp.dest(paths.dest))
//        .pipe(browserSync.reload({stream:true}))
//});



//把字体文件生成icon
var iconfont = require('gulp-iconfont');
var runTimestamp = Math.round(Date.now()/1000);
//生成字体文件任务
gulp.task('fonts', function(){
    return gulp.src(['assets/icons/*.svg'])
        .pipe(iconfont({
            fontName: 'myfont',
            prependUnicode: true,
            formats: ['ttf', 'eot', 'woff'],
            timestamp: runTimestamp,
        }))
        .on('glyphs', function(glyphs, options) {
            console.log(glyphs, options);
        })
        .pipe(gulp.dest('www/fonts/'));
});