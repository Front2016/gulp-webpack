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
var notify = require('gulp-notify');

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
	//编译scss
	.pipe(sass())
	// 保存一份编译完的
	// 。pipe(gulp.dest('./dest'))
	//压缩样式文件
	.pipe(minifycss())
	//给文件添加.min后缀
	.pipe(rename({ suffix: '.min' }))
	//输出压缩文件到指定目录
	.pipe(gulp.dest('./dest'))
	//提醒任务完成
	.pipe(notify({message:'css 编译压缩结束'}))

});


gulp.task('build',['default','compile'],function(){
	console.log('结束任务');
})