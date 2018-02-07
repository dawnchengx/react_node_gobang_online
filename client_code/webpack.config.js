module.exports = {
    entry: __dirname +"/app/app.js",//唯一的入口文件
      output:{
        path: __dirname +"/public",//打包后文件存放的目录
        filename:'bundle.js' //打包后输入的文件名
      },
      devServer:{
       contentBase: "./public",//本地服务器所加载的页面所在的目录
       historyApiFallback: true,//不跳转
       inline: true//实时刷新
     },
     //新增加部分
     module:{
        loaders:[
          //babel配置
          {
            test:/\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          }
        ]
     },
    //  dev: {
    //   autoOpenBrowser: true,
    //   proxyTable: {
    //       '/api': {
    //           target: 'http://localhost:8081', //设置调用接口域名和端口号别忘了加http
    //           changeOrigin: true,
    //           pathRewrite: {
    //               '^/api': '/' //这里理解成用‘/api’代替target里面的地址，组件中我们调接口时直接用/api代替
    //                   // 比如我要调用'http://0.0:300/user/add'，直接写‘/api/user/add’即可 代理后地址栏显示/
    //           }
    //       }
    //   }
    // }
  }