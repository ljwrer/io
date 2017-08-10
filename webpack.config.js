const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
function generateConfig(name) {
  var uglify = name.indexOf('min') > -1;
  var config = {
    entry: './src/index',
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/dist/',
      filename: name + '.js',
      library: 'io',
      libraryTarget: 'umd',
      umdNamedDefine: true
  },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader'
        }
      ]
    },
    externals : {
      lodash : {
        commonjs2: "lodash",
          commonjs: "lodash",
          amd: "lodash",
          root: "_" // indicates global variable
      }
    },
    devtool: 'source-map',
    plugins: []
  }

  if (uglify) {
    config.plugins.push(
      new UglifyJSPlugin({
        compressor: {
          warnings: false
        },
        sourceMap: true
      })
    );
  }

  return config;
}
var config = ['io', 'io.min'].map(function (key) {
  return generateConfig(key);
});
console.log(config)
module.exports = config
