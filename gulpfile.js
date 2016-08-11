var gulp = require('gulp');
// var minify = require('minify');

//文件监控
var watch = require('gulp-watch');


//jade和scss编译
var jade = require('gulp-jade');
var sass = require('gulp-sass');

//压缩css
var minifycss = require('gulp-minify-css');
//css中图片生成雪碧图
//gulp-css-spriter默认会对样式文件里，所有的background/background-image的图片合并，
//但实际项目中，我们不是所有的图片都需要合并。
//background-image: url(../slice/p1-3.png?__spriter);//有?__spriter后缀的合并
//background-image: url(../slice/p-cao1.png); //不合并 
//修改下面文件可以按需合并。node_modules\gulp-css-spriter\lib\map-over-styles-and-transform-background-image-declarations.js
var spriter = require('gulp-css-spriter');
//压缩js
//使用gulp-uglify压缩javascript文件，减小文件大小。
var uglify = require('gulp-uglify');
//压缩图片
//使用gulp-imagemin压缩图片文件（包括PNG、JPEG、GIF和SVG图片）
var imagemin = require('gulp-imagemin');
//深度压缩图片
//确保本地已安装imagemin-pngquant [cnpm install imagemin-pngquant --save-dev]
var pngquant = require('imagemin-pngquant');
//只压缩修改的图片。压缩图片时比较耗时，在很多情况下我们只修改了某些图片，没有必要压缩所有图片，
//使用”gulp-cache”只压缩修改的图片，没有修改的图片直接从缓存文件读取
//（C:\Users\Administrator\AppData\Local\Temp\gulp-cache）
var cache = require('gulp-cache');

//重命名文件
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


//文件操作
//删除文件
var del = require('del');

//问题：如何结合chmod使用




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
	  pretty: true //pretty也就是漂亮的格式化的
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
	//输出压缩文件到指定目录
	.pipe(gulp.dest('./dest'))
	//提醒任务完成
	.pipe(notify({message:'====编译结束===='}))
});


//压缩js和css任务
gulp.task('push', function(){
	//图片压缩问题：大小没变，压缩的条件是什么？
	//压缩css
	var timestamp = +new Date();
	gulp.src('./dest/css/*.{css}')
		//对backgound／background-image生成雪碧图
		.pipe(spriter({
            // 生成的spriter的位置
            'spriteSheet': './dest/img/sprite/sprite'+timestamp+'.png',
            // 生成样式文件图片引用地址的路径
            // 如下将生产：backgound:url(../images/sprite20324232.png)
            'pathToSpriteSheetFromCSS': '../img/sprite/sprite'+timestamp+'.png'
        }))
        //压缩样式文件
		.pipe(minifycss())
		//给文件添加.min后缀
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('./dest/css'))

	//压缩图片
	// gulp.src('./src/img/*.{png,jpg,gif,ico,jpeg}')
        // .pipe(imagemin({
        //     optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
        //     progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        //     interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
        //     multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        // }))
        // .pipe(gulp.dest('./dest/img'))
        // .pipe(notify({message:'====图片压缩结束===='}));

    //深度压缩图片
    // gulp.src('./src/img/*.{png,jpg,gif,ico,jpeg}')
    //     .pipe(imagemin({
    //         progressive: true,
    //         svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
    //         use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
    //     }))
    //     .pipe(gulp.dest('./dest/img'))
    //     .pipe(notify({message:'====图片深度压缩结束===='}));;

    //只压缩修改的图片。压缩图片时比较耗时，在很多情况下我们只修改了某些图片，
    //没有必要压缩所有图片，使用”gulp-cache”只压缩修改的图片，没有修改的图片直接从缓存文件读取
    gulp.src('./src/img/*.{png,jpg,gif,ico,jpeg}')
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('./dest/img'))
        .pipe(notify({message:'====修改过的图片压缩结束===='}));

	//压缩js
	gulp.src('./src/*.js')
		.pipe(uglify({
	        mangle: true,//类型：Boolean 默认：true 是否修改变量名
	        compress: true,//排除混淆关键字,//类型：Boolean 默认：true 是否完全压缩
	        preserveComments: 'all' //保留所有注释
	    }))
	    .pipe(rename({ suffix: '.min' }))
	    .pipe(gulp.dest('./dest'))
	    .pipe(notify({message:'====压缩结束===='}))
})


/******************************* 以上是颗粒任务 *****************************************/

// 监控任务
gulp.task('watch', function(){
	//监控哪些文件，并执行哪些任务来处理
	gulp.watch('./src/css/*.scss',['compile'])
	.on('change', function(){
		//浏览器重新刷新
		browserSync.reload();
		console.log('====文件改变监控，重新编译完成====');
	})
})

// 删除文件任务
gulp.task('del', function(){
	del('./dest/index.min.js');
	console.log('====文件删除完毕====');
})

/******************************* 以上是颗粒监听 *****************************************/

gulp.task('build',['default','dev:server','compile','push','watch'],function(){
	console.log('结束任务');
})