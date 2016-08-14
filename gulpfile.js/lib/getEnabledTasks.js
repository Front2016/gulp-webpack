var config = require('../config');
var compact = require('lodash/array/compact');

// Grouped by what can run in parallel
var assetTasks = ['fonts', 'iconFont', 'images', 'svgSprite'];
var codeTasks = ['jade','css', 'js'];
var moveTasks = ['move'];

module.exports = function(env) {
  //根据传入的参数,选择执行不同的webpack,有开发环境,监测环境
  var jsTasks = {
    watch: 'webpack:watch',
    development: 'webpack:development',
    production: 'webpack:production'
  };
  //任务筛选,如果是js则根据环境执行webpack
  var matchFilter = function(task) {
    if(config.tasks[task]) {
      if(task === 'js') {
        task = jsTasks[env] || jsTask.watch
      }
      return task
    }
  };
  //返回三组任务列表
  return {
    assetTasks: compact(assetTasks.map(matchFilter)),
    codeTasks : compact(codeTasks.map(matchFilter)),
    moveTasks : compact(codeTasks.map(matchFilter))
  }
};
