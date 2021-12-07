const path = require('path')

class ReplaceVendorsPlugin {
  constructor() {}

  apply(compiler) {
    compiler.hooks.compilation.tap(this.constructor.name, compilation => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(this.constructor.name, htmlPluginData => {
        htmlPluginData.html = htmlPluginData.html.replace('vue.runtime.js', 'vue.runtime.min.js')
        return htmlPluginData
      })
    })
  }
}

module.exports = {
  css: {
    loaderOptions: {
      less: {
        additionalData: `@import (reference) "~src/less/Bootstrapping/Mixins";`
      }
    }
  },
  pages: {
    index: 'src/pages/index/app.js',
    login: 'src/pages/login/app.js',
    post: 'src/pages/post/app.js',
    blog: 'src/pages/blog/app.js',
    home: {
      entry: 'src/pages/home/app.js',
      template: 'public/template.html',
      title: '个人中心 · 轻语'
    },
    admin: {
      entry: 'src/pages/admin/app.js',
      template: 'public/admin.html',
      title: '后台管理 · 轻语'
    },
    repo: {
      entry: 'src/pages/repo/app.js',
      template: 'public/blog.html',
      title: '知识库 · 轻语'
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8101',
        changeOrigin: true
      },
      '/upload': {
        target: 'http://localhost:8101',
        changeOrigin: true
      },
      '/admin': {
        target: 'http://localhost:8101',
        bypass() {
          return '/admin.html'
        }
      }
    }
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch')
  },
  configureWebpack: {
    externals: {
      vue: 'Vue'
    },
    resolve: {
      extensions: ['*', '.js', '.vue', '.json'],
      alias: {
        src: path.join(__dirname, 'src')
      }
    },
    plugins: process.env.NODE_ENV === 'production' ? [
      new ReplaceVendorsPlugin()
    ] : []
  }
}
