var gulp = require('gulp');
// var minify = require('minify');

//在这主要用来渲染模板
var express = require('express');
//实例化express对象
var app = express();
//express指定静态文件目录
app.use('/static', express.static('./dest'));
// app.use(express.static('public'));
// app.use(express.static('files'));

//模块化js编译 es6
var webpack = require('webpack');
var webpackConfig = require("./webpack.config.js");

//响应压缩
var compression = require('compression')
app.use(compression())


//开发环境区分
var env = process.env.NODE_ENV || 'development';

//文件监控
var watch = require('gulp-watch');

/******************************* 编译系列 *****************************************/

//jade和scss编译
var jade = require('gulp-jade');
var sass = require('gulp-sass');

//该插件能够实现 只编译或打包改变过文件 ，大大加快了gulp task的执行速度。比如只操作发生过改变的文件。
var changed = require('gulp-changed');

/******************************* 压缩系列 *****************************************/

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
//压缩html
var htmlmin = require('gulp-htmlmin');
//gulp.src('src/*.html')
// .pipe(htmlmin({collapseWhitespace: true}))
// .pipe(gulp.dest('dist'))

//压缩svg
var svgstore = require('gulp-svgstore');
// gulp.task('default', function () {
//     return gulp
//         .src('src/svg/**/*.svg', { base: 'src/svg' })
//         .pipe(rename({prefix: 'icon-'}))
//         .pipe(svgstore())
//         .pipe(gulp.dest('dest'));
// });

//把字体文件生成icon
var iconfont = require('gulp-iconfont');
var runTimestamp = Math.round(Date.now()/1000);

//添加浏览器前缀,来自动兼容不同的浏览器，不如css3里边不同浏览器的差异。ex:transition
//-webkit-transition:
//-o-transition:
var autoprefixer = require('gulp-autoprefixer');

//终端输出标记
var chalk = require('chalk');
//notify的功能主要有两点，显示报错信息和报错后不终止当前gulp任务
var notify = require('gulp-notify');
//debug调试，查看stream流
var debug = require('gulp-debug');
//打印日志到终端
var morgan = require('morgan');
// var logger = morgan('combined')
// http.createServer(function (req, res) {
//   var done = finalhandler(req, res)
//   logger(req, res, function (err) {
//     if (err) return done(err)
 
//     // respond to request 
//     res.setHeader('content-type', 'text/plain')
//     res.end('hello, world!')
//   })
// })


//浏览器服务,BrowserSync可以同时同步刷新多个浏览器，
//更神奇的是你在一个浏览器中滚动页面、点击按钮、输入框中输入信息等用户行为也会同步到每个浏览器中。
//能让浏览器实时、快速响应文件更改（html、js、css、sass、less等）并自动刷新页面
var browserSync = require('browser-sync');
var bs = browserSync.create('My server');

//数据支持
//通过文件的方式，给jade文件提供传递数据，便于接口调试
var data = require('gulp-data');
// data(function(file, callback) {
//   return callback(undefined, { 'foo': 'bar' });
// })

//数据渲染
var nunjucksRender = require('gulp-nunjucks-render');
// gulp.src('src/templates/*.html')
// .pipe(data(getDataForFile))
// .pipe(nunjucksRender({
//   path: 'src/templates'
// }))
// 用来渲染html结构的
//<link rel="stylesheet" href="{{ css_path }}test.css" />

//文件过滤
//跟gulp.src类似，但是支持字符流的暂存和回退
var filter = require('gulp-filter');

//gulp条件判断
var gulpif = require('gulp-if');
// var condition = true;
// gulp.src('./src/*.js')
// .pipe(gulpif(condition, uglify()))
// .pipe(gulp.dest('./dist/'));

//gulp任务执行顺序
var sequence = require('gulp-sequence');
// 1. run 'a', 'b' in parallel; 
// 2. run 'c' after 'a' and 'b'; 
// 3. run 'd', 'e' in parallel after 'c'; 
// 3. run 'f' after 'd' and 'e'. 
// gulp.task('sequence-1', gulpSequence(['a', 'b'], 'c', ['d', 'e'], 'f'));

/******************************* 文件操作系列 *****************************************/

//文件操作
//删除文件
var del = require('del');
//重命名文件
var rename = require('gulp-rename');
//统计输出文件大小
var size = require('gulp-filesize');
// gulp.src('./css/*.css')
// .pipe(gulp.dest('./dist/')
// .pipe(size()) // [gulp] Size example.css: 265.32 kB 

//统计文件的大小
//Display the size and gzipped size of your project, trigger alarm when file size is higher as expected
var sizereport = require('gulp-sizereport');

//日志，文件名修改等
var gutil = require('gulp-util');
// gutil.log('stuff happened', 'Really it did', gutil.colors.magenta('123'));
// gutil.beep();
// gutil.replaceExtension('file.coffee', '.js'); // file.js 

//问题：如何结合chmod使用
var chmod = require('gulp-chmod');
// .pipe(chmod(755))
// .pipe(gulp.dest('dist'));


//第三方服务支持
//它是会把指定目录的内容推送到git仓库的gh-pages分支上。
//利用git pages静态http server的特性可快速建立网站。
var gp_deploy = require('gulp-gh-pages');
// 指定目录
// var options = {}
// gulp.task('push', function () {
//     return gulp.src('./preview/**/*')
//         .pipe(gp_deploy(options));
// });

//给文件添加hash前缀，生成静态文件map，防止缓存
var rev = require('gulp-rev');
// .pipe(gulp.dest('build/assets'))  // copy original assets to build dir 
// .pipe(rev())
// .pipe(gulp.dest('build/assets'))  // write rev'd assets to build dir 
// .pipe(rev.manifest())
// .pipe(gulp.dest('build/assets')); // write manifest to build dir 

// 生成map文件
var revNapkin = require('gulp-rev-napkin');
// .pipe(rev())
// .pipe(gulp.dest('dest/'))
// .pipe(revNapkin()); // Just place after gulp-rev(-all) 

//替换文件用的，把html中的静态文件替换成map中的
var revReplace = require('gulp-rev-replace');
// gulp.task("revision", ["dist:css", "dist:js"], function(){
//   return gulp.src(["dist/**/*.css", "dist/**/*.js"])
//     .pipe(rev())
//     .pipe(gulp.dest(opt.distFolder))
//     .pipe(rev.manifest())
//     .pipe(gulp.dest(opt.distFolder))
// })
 
// gulp.task("revreplace", ["revision"], function(){
//   var manifest = gulp.src("./" + opt.distFolder + "/rev-manifest.json");
 
//   return gulp.src(opt.srcFolder + "/index.html")
//     .pipe(revReplace({manifest: manifest}))
//     .pipe(gulp.dest(opt.distFolder));
// });





// 不知道干嘛的
var sourcemaps = require('gulp-sourcemaps');

//获取文件资源
var open = require("open");
// open("http://www.google.com");
// open("http://www.google.com", "firefox");



//生成json
var objectAssign = require('object-assign');
// ignores null and undefined sources 
//objectAssign({foo: 0}, null, {bar: 1}, undefined);
//=> {foo: 0, bar: 1} 


// var stream1 = new Stream();
// var stream2 = new Stream();
// var merged = mergeStream(stream1, stream2);
// var stream3 = new Stream();
// merged.add(stream3);
// merged.isEmpty();


//时间统计
var prettyHrtime = require('pretty-hrtime');
// var start = process.hrtime();
// do stuff 
// var end = process.hrtime(start);
// var words = prettyHrtime(end);
// console.log(words); // '1.2 ms' 
// words = prettyHrtime(end, {precise:true});
// console.log(words); // '1.20958 ms' 



//把不同的任务放在不同的文件中，指定文件目录即可
var requireDir = require('require-dir');
//找tasks文件夹中的文件
// requireDir('./gulp/tasks');


//添加node js方法拓展
// Load the full build. 
var _ = require('lodash');
// Load the core build. 
// var _ = require('lodash/core');
// // Load the fp build for immutable auto-curried iteratee-first data-last methods. 
// var fp = require('lodash/fp');
// // Load a method category. 
// var array = require('lodash/array');
// var object = require('lodash/fp/object');
// // Load a single method for smaller builds with browserify/rollup/webpack. 
// var chunk = require('lodash/chunk');
// var extend = require('lodash/fp/extend');

/******************************* 以上是模块导入 *****************************************/
/******************************* 以上是模块导入 *****************************************/
/******************************* 以上是模块导入 *****************************************/

//默认任务
gulp.task('default', function(){
	// 将你的默认的任务代码放在这
  return gulp.src('./dest/index.min.js')
          .pipe(debug({title: 'unicorn:'}))
          .pipe(gulp.dest('./dest'));
	console.log('=====开始默认初始化=====');
});


// dev server
// 启动 express 并添加 browserSync 支持
gulp.task('dev:server', function () {
  app.get('/', function (req, res) {
    res.send('Hello World')
  })
  app.listen(3000)
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
    baseDir: "./dest",
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
    //sourcemaps初始化
    .pipe(sourcemaps.init({loadMaps: true}))
    //给jade提供数据
    .pipe(data(function(file,callback) {
      // return require('./examples/' + path.basename(file.path) + '.json');
      return require('./data/a.json');
    }))
  	.pipe(jade({
  	  pretty: true //pretty也就是漂亮的格式化的
  	}))
    //这是干嘛的？
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('./dest'))

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

//生成字体文件任务
gulp.task('Iconfont', function(){
  return gulp.src(['assets/icons/*.svg'])
    .pipe(iconfont({
      fontName: 'myfont', // required 
      prependUnicode: true, // recommended option 
      formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available 
      timestamp: runTimestamp, // recommended to get consistent builds when watching files 
    }))
      .on('glyphs', function(glyphs, options) {
        // CSS templating, e.g. 
        console.log(glyphs, options);
      })
    .pipe(gulp.dest('www/fonts/'));
});


//压缩js和css任务
gulp.task('push', function(){
	//图片压缩问题：大小没变，压缩的条件是什么？
	//压缩css
	var timestamp = +new Date();
  del('./dest/img/sprite/*')
	gulp.src('./dest/css/*.css')
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
    .pipe(rev())
    .pipe(gulp.dest('./dest/css/assets'))
    .pipe(rev.manifest())
    .pipe(chmod(755))
		.pipe(gulp.dest('./'))
    //.pipe(size()) //我怎么没看到效果

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
        //只把修改过的已js结尾的文件进行编译
        .pipe(changed('./dest/*.{js}'))
  		  .pipe(uglify({
  	        mangle: true,//类型：Boolean 默认：true 是否修改变量名
  	        compress: true,//排除混淆关键字,//类型：Boolean 默认：true 是否完全压缩
  	        preserveComments: 'all' //保留所有注释
  	    }))
  	    .pipe(rename({ suffix: '.min' }))
  	    .pipe(gulp.dest('./dest'))
        .pipe(sizereport({
            gzip: true,
            // minifier: function (contents) {
            //     return UglifyJS.minify(contents, { fromString: true }).code;
            // },
            // '*': {
            //     'maxSize': 100000
            // },
            // 'pin.js': {
            //     'maxMinifiedSize': 5500,
            //     'maxMinifiedGzippedSize': 2500 
            // }
        }))
  	    .pipe(notify({message:'====压缩结束===='}))

    //压缩html
    gulp.src('./dest/*.html')
        //删除空格进行压缩
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dest'))

})

gulp.task('webpack', function(){
  var myConfig = Object.create(webpackConfig);
  // run webpack
  webpack(
    // configuration
    myConfig,
    function (err, stats) {
      var end = process.hrtime();
      var words = prettyHrtime(end);
      console.log(words); // '1.2 ms' 
      words = prettyHrtime(end, {precise:true});
      console.log(words); // '1.20958 ms' 

      // if(err) throw new gutil.PluginError("webpack", err);
      // gutil.log("[webpack]", stats.toString({
      //   // output options
      // }));
      //callback();
    });
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

gulp.task('build',['default','dev:server','compile','push','webpack','watch'],function(){
	console.log('结束任务');
})

//规定任务执行顺序
gulp.task('sequence', sequence(['a', 'b'], 'compile','push'));




