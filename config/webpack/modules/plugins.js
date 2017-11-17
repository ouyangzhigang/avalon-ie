require('shelljs/global');
const base      = require('../base/base'),
      files     = require('../base/files'),
      HappyPack = require('happypack'),
      path      = require('path'),
      ora       = require('ora'),
      chalk     = require('chalk'),
      webpack   = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');

console.log(
    chalk.blue.bold(
        '  Tip:\n' +
        '  Built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
    )
);

let assetsPath = path.join(__dirname, '../../../build/static/');
console.log(chalk.red.bold(assetsPath));

let spinner = ora('cfonts "building for production..."');
spinner.start();

rm('-rf', assetsPath);
mkdir('-p', assetsPath);
cp('-R', 'static/*', assetsPath);

module.exports = [
  // 清除构建前文件
  // new CleanPlugin([`${files.buildPath}/*`], {
  //   root: process.cwd(),
  //   exclude: ['vendors'], // 测试模式保留vendors文件
  //   verbose: true,
  //   dry: false
  // }),
  // 复制静态地址文件
  // new CopyPlugin([
  //   {
  //     from: path.join(process.cwd(), 'static'),
  //     to: path.join(process.cwd(), files.buildPath),
  //     ignore: ['.*']
  //   }
  // ]),
  new webpack.NoEmitOnErrorsPlugin(),
  require('precss'),
  require('autoprefixer'),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    options: {
      postcss: base.cssType === 'pcss' ? [
          require("postcss-cssnext")(({
            features: {
              customProperties: false
            }
          })),
        ] : [require('autoprefixer')({
          browsers: ['> 1%', 'last 5 versions', 'Firefox ESR'],
          cascade: false
        })]
    }
  }),
  cHappypack('HTML', ['html-loader']),

  cHappypack('ES3', ['es3ify-loader']),

  cHappypack('JSX', [{
    loader: 'babel-loader',
    query: require('./babel')
  }]),
];


function cHappypack(id, loaders) {
    spinner.stop();
    return new HappyPack({
        id: id,
        debug: false,
        verbose: false,
        cache: true,
        threads: 4,
        cacheContext: {
            env: process.env.NODE_ENV
        },
        loaders: loaders
    })
}