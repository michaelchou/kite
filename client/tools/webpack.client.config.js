const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../../kite.config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const pordWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    path: config.client.assetsRoot,
    // chunkhash是根据内容生成的hash, 易于缓存
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: false,
      // 将css样式单独提取出文件
      extract: false, // 使用 vue-style-loader 处理css
      usePostCSS: true
    })
  },
  resolve: {
    alias: {
      'request-config': '../request/requestClient.js'
    }
  },
  devtool: false,
  plugins: [
    // webpack4.0版本以上采用MiniCssExtractPlugin 而不使用extract-text-webpack-plugin
    // new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      chunkFilename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    //  当vendor模块不再改变时, 根据模块的相对路径生成一个四位数的hash作为模块id
    new webpack.HashedModuleIdsPlugin()
  ],
  optimization: {
    splitChunks: {
      maxInitialRequests: 6,
      cacheGroups: {
        dll: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/](core-js|vue|vue-router)[\\/]/,
          name: 'dll',
          priority: 2,
          enforce: true,
          reuseExistingChunk: true
        },
        superSlide: {
          chunks: 'all',
          test: /[\\/]src[\\/]assets[\\/]js[\\/]/,
          name: 'superSlide',
          priority: 1,
          enforce: true,
          reuseExistingChunk: true
        },
        commons: {
          name: 'commons',
          minChunks: 2, // Math.ceil(pages.length / 3), 当你有多个页面时，获取pages.length，至少被1/3页面的引入才打入common包
          chunks: 'all',
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  }
})

if (process.env.NODE_ENV === 'production') {
  pordWebpackConfig.plugins.push(
    // auto generate service worker
    new SWPrecachePlugin({
      cacheId: 'vue-hn',
      filename: 'service-worker.js',
      minify: false,
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'networkFirst'
        }
      ]
    })
  )
}

module.exports = pordWebpackConfig
