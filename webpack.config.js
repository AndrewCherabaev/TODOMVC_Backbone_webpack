const path = require('path');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    devtool: 'inline-source-map',
    output: {
      filename: 'app.bundle.js',
      chunkFilename: 'app.bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
    ,module:{
        rules: [{
          test: /\.html$/,
          use: [ {
            loader: 'html-loader',
            options: {
              minimize: true,
              removeComments: false
            }
          }],
        }]
    }
}