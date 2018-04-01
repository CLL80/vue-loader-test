'use strict'

const path = require('path')
const webpack = require('webpack')
const Autoprefixer = require('autoprefixer')
const postCSSInlineSVG = require('postcss-inline-svg')
const postCSSFilterGradient = require('postcss-filter-gradient')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const urlLoaderSizeLimit = 50000 // in bytes

const config = {
  path_base  : path.resolve(__dirname),
  dir_client: 'src',
  dir_dist: 'dist',
  compiler_public_path: '/',
  sourcemaps: true
}
config.utils_paths = (() => {
  const resolve = path.resolve

  const base = (...args) =>
    resolve.apply(resolve, [config.path_base, ...args])

  return {
    base   : base,
    client : base.bind(null, config.dir_client),
    dist   : base.bind(null, config.dir_dist)
  }
})()

const paths = config.utils_paths

module.exports = (options) => {
  config.sourcemaps = !options.isProduction
  const webpackConfig = {
    devtool: options.devtool,
    resolve: {
      modules: [
        paths.client(),
        'node_modules'
      ],
      extensions: ['.js', '.jsx'],
      alias: {
        vue$: 'vue/dist/vue.common.js'
      }
    },
    devServer: {
      port: options.port,
      host: '0.0.0.0'
    },
    entry: './src/scripts/index.vue',
    output: {
      filename: 'js/bundle.js',
      path: paths.dist(),
      publicPath: config.compiler_public_path
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(options.isProduction ? 'production' : 'development')
        }
      }),
      new HtmlWebpackPlugin({
        template: paths.client('index.html'),
        minify: {
          collapseWhitespace: true
        }
      }),
      new ExtractTextPlugin({
        filename: 'css/[name].[hash].css',
        disable: !options.isProduction
      })
    ],
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              query: {
                presets: ['es2015'],
                plugins: ['transform-runtime']
              }
            },
            {
              test: /\.vue$/,
              loader: 'vue-loader',
              options: {
                postcss: [
                  postCSSInlineSVG({ path: paths.client() }),
                  postCSSFilterGradient({ path: paths.client() })
                ],
                loaders: {
                  js: {
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                      presets: ['es2015'],
                      plugins: ['transform-runtime']
                    }
                  },
                  scss: ExtractTextPlugin.extract({
                    fallback: 'vue-style-loader',
                    use: [
                      `css-loader?minimize${config.sourcemaps ? '&sourceMap' : ''}`,
                      `sass-loader${config.sourcemaps ? '&sourceMap' : ''}`
                    ]
                  }),
                  sass: ExtractTextPlugin.extract({
                    fallback: 'vue-style-loader',
                    use: [
                      `css-loader?minimize${config.sourcemaps ? '&sourceMap' : ''}`,
                      `sass-loader?indentedSyntax${config.sourcemaps ? '&sourceMap' : ''}`
                    ]
                  })
                }
              }
            },
            {
              exclude: [/\.js$/, /\.html$/, /\.json$/, /\.ejs$/, /\.md$/],
              loader: require.resolve('file-loader'),
              options : {
                name  : 'static/[name].[ext]'
              }
            }
          ]
        }
      ]
    }
  }

  if (options.isProduction) {
    webpackConfig.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: config.sourcemaps,
        compressor: {
          warnings: false
        }
      })
    )
  }
  return webpackConfig;
};
