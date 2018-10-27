const path = require('path');

module.exports = {
    entry: './src/app.js',
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
              removeComments: true,
              collapseWhitespace: true
            }
          }],
        }]
    }
}