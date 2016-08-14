/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in gulpfile.js/tasks. Any files in that directory get
  automatically required below.

  To add a new task, simply add a new task file that directory.
  gulpfile.js/tasks/default.js specifies the default set of tasks to run
  when you run `gulp`.
*/

/**
 * 使用require-dir把之前的把任务放在一个文件夹里,使用分到不同的文件中.
 */
var requireDir = require('require-dir');

// Require all tasks in gulpfile.js/tasks, including subfolders
/**
 * 任务文件放在当前目录的tasks文件夹中
 */
requireDir('./tasks', { recurse: true });