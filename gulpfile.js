var gulp = require('gulp');
// var minify = require('minify');

//jade和scss编译
var jade = require('gulp-jade');
var sass = require('gulp-sass');


//压缩
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');

//终端输出标记
var chalk = require('chalk');

gulp.task('default', function(){
	// 将你的默认的任务代码放在这
	console.log('开始默认初始化');
	chalk.yellow('start server');
});


gulp.task('compile', function() {
  // jade和scss编译
	gulp.src('./src/page/*.jade')
	.pipe(jade({
	  pretty: true
	})).pipe(gulp.dest('./dest'))

	gulp.src('./src/css/*.scss',{base : 'src'})
	.pipe(sass())
	.pipe(minifycss())
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('./dest'))

});


gulp.task('build',['default','compile'],function(){
	console.log('结束任务');
})