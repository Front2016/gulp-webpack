/**
 * Created by lio on 16/8/7.
 */

var path = require('path');


module.exports = {
  entry: [
    // 'webpack/hot/dev-server',
    // 'webpack-dev-server/client?http://localhost:3000',
    path.resolve(__dirname, 'src/js/main.js')
  ],
  output: {
    path: path.resolve(__dirname, 'dest/js/'),
    filename: 'bundle.js',
  },
};