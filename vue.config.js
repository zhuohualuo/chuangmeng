// const domain = "http://localhost.ua.mobgi.com/";
const domain = "http://test.ua.mobgi.com/";

module.exports = {
  productionSourceMap: false,
  publicPath: "front",
  pages: {
    // 只有entry属性时，直接用字符串表示模块入口
    index: {
      // 应用入口配置，相当于单页面应用的main.js，必需项
      entry: "src/pages/index/index.js",
      // 应用的模版，相当于单页面应用的public/index.html，可选项，省略时默认与模块名一致
      // template: "public/console.html",
      // 编译后在dist目录的输出文件名，可选项，省略时默认与模块名一致
      // filename: "console.html",
      title: "首页"
      // 包含的模块，可选项
      // chunks: ["index"]
    },
    login: {
      entry: "src/pages/login/index.js",
      title: "登录"
    },
    business: {
      entry: "src/pages/business/index.js",
      title: "商务合作"
    }
  },
  devServer: {
    proxy: {
      "^/Admin": {
        target: domain,
        ws: true,
        changeOrigin: true,
        cookieDomainRewrite: true,
        pathRewrite: {
          "^/Admin": "/Admin"
        },
        onProxyReq: function onProxyReq(proxyReq) {
          console.warn(`代理请求===${proxyReq.path}`);
        }
      },
      "^/idt": {
        target: domain,
        ws: true,
        changeOrigin: true,
        cookieDomainRewrite: true,
        pathRewrite: {
          "^/idt": "/idt"
        },
        onProxyReq: function onProxyReq(proxyReq) {
          console.warn(`代理请求===${proxyReq.path}`);
        }
      },
      "^/attachs": {
        target: domain,
        ws: true,
        changeOrigin: true,
        cookieDomainRewrite: true,
        pathRewrite: {
          "^/attachs": "/attachs"
        },
        onProxyReq: function onProxyReq(proxyReq) {
          console.warn(`代理请求===${proxyReq.path}`);
        }
      },
      "^/static/js/common": {
        target: domain,
        ws: true,
        changeOrigin: true,
        cookieDomainRewrite: true,
        pathRewrite: {
          "^/static/js/common": "/static/js/common"
        },
        onProxyReq: function onProxyReq(proxyReq) {
          console.warn(`代理请求===${proxyReq.path}`);
        }
      },
      "^/static/js/admin": {
        target: domain,
        ws: true,
        changeOrigin: true,
        cookieDomainRewrite: true,
        pathRewrite: {
          "^/static/js/admin": "/static/js/admin"
        },
        onProxyReq: function onProxyReq(proxyReq) {
          console.warn(`代理请求===${proxyReq.path}`);
        }
      },
      "^/static/css/spm": {
        target: domain,
        ws: true,
        changeOrigin: true,
        cookieDomainRewrite: true,
        pathRewrite: {
          "^/static/css/spm": "/static/css/spm"
        },
        onProxyReq: function onProxyReq(proxyReq) {
          console.warn(`代理请求===${proxyReq.path}`);
        }
      },
      "^/static/css/gri.controls": {
        target: domain,
        ws: true,
        changeOrigin: true,
        cookieDomainRewrite: true,
        pathRewrite: {
          "^/static/css/gri.controls": "/static/css/gri.controls"
        },
        onProxyReq: function onProxyReq(proxyReq) {
          console.warn(`代理请求===${proxyReq.path}`);
        }
      },
      "^/static/css/mgchart": {
        target: domain,
        ws: true,
        changeOrigin: true,
        cookieDomainRewrite: true,
        pathRewrite: {
          "^/static/css/mgchart": "/static/css/mgchart"
        },
        onProxyReq: function onProxyReq(proxyReq) {
          console.warn(`代理请求===${proxyReq.path}`);
        }
      },
      "^/static/css/selectorplug": {
        target: domain,
        ws: true,
        changeOrigin: true,
        cookieDomainRewrite: true,
        pathRewrite: {
          "^/static/css/selectorplug": "/static/css/selectorplug"
        },
        onProxyReq: function onProxyReq(proxyReq) {
          console.warn(`代理请求===${proxyReq.path}`);
        }
      },
      "^/static/landingpage": {
        target: domain,
        ws: true,
        changeOrigin: true,
        cookieDomainRewrite: true,
        pathRewrite: {
          "^/static/landingpage": "/static/landingpage"
        },
        onProxyReq: function onProxyReq(proxyReq) {
          console.warn(`代理请求===${proxyReq.path}`);
        }
      },
      "^/api": {
        target: "http://localhost.ua.mobgi.com/",
        ws: true,
        changeOrigin: true,
        cookieDomainRewrite: true,
        pathRewrite: {
          "^/static/css/selectorplug": "/static/css/selectorplug"
        },
        onProxyReq: function onProxyReq(proxyReq) {
          console.warn(`代理请求===${proxyReq.path}`);
        }
      }
    }
  },
  chainWebpack: config => {
    /* 添加分析工具*/
    if (process.env.NODE_ENV === "production") {
      config.plugins.delete("prefetch");

      if (process.env.npm_config_report) {
        config
          .plugin("webpack-bundle-analyzer")
          .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin)
          .end();
      }
    }
  }
};
