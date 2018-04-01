module.exports = require('./webpack-base.config')({
  isProduction: false,
  devtool: '#eval-source-map',
  port: 3000
});