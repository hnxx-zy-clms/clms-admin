'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'Clms 后台' // 页面标题

const port = 8081 // dev port 设置运行端口

/**
 * vue.config.js 是一个可选的配置文件
 * module.exports 用于导出所选项的对象
 */
module.exports = {

  /**
   * 1. publicPath --> 默认: '/' 应用部署的根目录
   * 2. publicDir --> 默认: 'dist' 运行时将在其中生成生产构建文件的目录
   * 3. assetsDir --> 默认: '' 生成静态资源(js,css,img,字体)的目录
   * 4. lintOnSave --> 默认: true 类型 boolean | 'warning' | 'default' | 'error'
   *    在开发过程中是否使用 eslint-loader 执行保存时的存储
   * 5. productionSourceMap --> 默认: true 如果不需要用于生产的源映射,fals设置可以加快生产构建
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // 6. devServer.proxy --> API 请求代理服务器
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        // target: `http://175.24.9.127:8080`,
        target: `http://localhost:8080`,
        // target: `http://120.79.102.52:9090`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },
  // 7. [webpack 简单配置] configureWebpack 如果该值为 Object,则将使用 webpack-merge 将其合并到最终配置
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  /**
   * 8. [webpack 链接] chainWebpack 内部 webpack 配置使用 webpack-chain,
   * 该库提供了对原始webpack配置的抽象，能够定义命名的加载程序规则和命名的插件，并随后“点击”这些规则并修改其选项。
   */
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader 设置 svg-sprite 加载器
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace 设置保留空白
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
    // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` 必须与 runtimeChunk 同名,默认为 `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // 仅打包最初的第三方依赖
                },
                elementUI: {
                  name: 'chunk-elementUI', // 将 element ui 拆分成单个包
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm 适应 cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules 可以自定义规则
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
