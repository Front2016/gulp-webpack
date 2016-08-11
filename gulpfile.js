var gulp = require('gulp');
// var minify = require('minify');

//文件监控
var watch = require('gulp-watch');


//jade和scss编译
var jade = require('gulp-jade');
var sass = require('gulp-sass');

//压缩
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');

//添加浏览器前缀,来自动兼容不同的浏览器，不如css3里边不同浏览器的差异。ex:transition
//-webkit-transition:
//-o-transition:
var autoprefixer = require('gulp-autoprefixer');

//终端输出标记
var chalk = require('chalk');
var notify = require('gulp-notify');

//浏览器服务,BrowserSync可以同时同步刷新多个浏览器，
//更神奇的是你在一个浏览器中滚动页面、点击按钮、输入框中输入信息等用户行为也会同步到每个浏览器中。
//能让浏览器实时、快速响应文件更改（html、js、css、sass、less等）并自动刷新页面
var browserSync = require('browser-sync');
var bs = browserSync.create('My server');




/******************************* 以上是模块导入 *****************************************/

//默认任务
gulp.task('default', function(){
	// 将你的默认的任务代码放在这
	console.log('=====开始默认初始化=====');
});


// dev server
// 启动 express 并添加 browserSync 支持
gulp.task('dev:server', function () {
  // 启动node
  // nodemon({
  //   script: 'server.js',
  //   ignore: ['.vscode', '.idea', 'node_modules'],
  //   env: {
  //     'NODE_ENV': 'development'
  //   }
  // });

  //等安装了express就能展示
  bs.init(null, {
  	//目的是启动一个端口来见负责检测改变刷新页面，页页面展示无关，所以端口要和web端口分开，
  	//files就是要检测的文件，重新刷新文件
    proxy: 'http://localhost:' + 5000,
    files: ['./dest/*.html'],
    notify: false,
    open: true,
    port: 3000
  })
});


//jade和scss编译任务
gulp.task('compile', function() {
  // jade和scss编译
	gulp.src('./src/page/*.jade')
	.pipe(jade({
	  pretty: true
	})).pipe(gulp.dest('./dest'))

	gulp.src('./src/css/*.scss',{base : 'src'})
	//文件添加前缀
	.pipe(autoprefixer({
		browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
        cascade: true, //是否美化属性值 默认：true 像这样：
        //-webkit-transform: rotate(45deg);
        //transform: rotate(45deg);
        remove:true //是否去掉不必要的前缀 默认：true 
	}))
	//编译scss 
	//style有四种编译格式:1.nested 2.expanded 3.compact 4.compressed
	.pipe(sass({style:"nested"}))
	// 保存一份编译完的
	// .pipe(gulp.dest('./dest'))
	//压缩样式文件
	.pipe(minifycss())
	//给文件添加.min后缀
	.pipe(rename({ suffix: '.min' }))
	//输出压缩文件到指定目录
	.pipe(gulp.dest('./dest'))
	//提醒任务完成
	.pipe(notify({message:'css 编译压缩结束'}))
});


/******************************* 以上是颗粒任务 *****************************************/

gulp.task('watch', function(){
	gulp.watch('./src/css/*.scss',['compile'],function(){
		console.log('====文件改变监控，重新编译完成====');
	})
	.on('change', browserSync.reload)
})

/******************************* 以上是颗粒监听 *****************************************/

gulp.task('build',['default','dev:server','compile','watch'],function(){
	console.log('结束任务');
})