const base          = require('../config/webpack/base/base'),
      files         = require('../config/webpack/base/files'),
      webpackConfig = require('../config/webpack/webpack.dev'),
      express       = require('express'),
      opn           = require('opn'),
      webpack       = require('webpack');

const app = express();
// Apply gzip compression
//const compress      = require('compression')
//app.use(compress());

/** -----------------------------------
 * Apply Webpack HMR Middleware
 * */
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackConfig);
  
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: files.cdnPath,
    quiet     : true,
    stats     : {colors: true}
  }));
  
  app.use(require('webpack-hot-middleware')(compiler));
  app.use('/static', express.static('/static'));
  app.use('/', express.static(files.buildPath));
  app.listen(base.devPort, () => {
    console.log(`open localhost:${base.devPort}`);
  });
  opn(`http://localhost:${base.devPort}`);
}
else {
  console.log(
    `Server not being run of live development mode,
      Please use the NODE_ENV=development mode to run`
  );
}

module.exports = app;

/**
  express.static(root, [options])
  express.static 是 Express 内置的唯一一个中间件。是基于 serve-static 开发的，负责托管 Express 应用内的静态资源。

  root 参数指的是静态资源文件所在的根目录。

  options 对象是可选的，支持以下属性：

  属性	描述	类型	默认值
  dotfiles	Option for serving dotfiles. Possible values are “allow”, “deny”, and “ignore”	String	“ignore”
  etag	Enable or disable etag generation	Boolean	true
  extensions	Sets file extension fallbacks.	Boolean	false
  index	Sends directory index file. Set false to disable directory indexing.	Mixed	“index.html”
  lastModified	Set the Last-Modified header to the last modified date of the file on the OS. Possible values are true or false.	Boolean	true
  maxAge	Set the max-age property of the Cache-Control header in milliseconds or a string in ms format	Number	0
  redirect	Redirect to trailing “/” when the pathname is a directory.	Boolean	true
  setHeaders	Function for setting HTTP headers to serve with the file.	Function
  关于此中间件的细节，请参考 通过 Express 托管静态资源文件。
 */