var WebpackDevServer = require('webpack-dev-server'),
  webpack = require('webpack'),
  config = require('./dev.config'),
  host = process.env.VIRTUAL_HOST || '10.10.10.10',
  port = parseInt(process.env.PORT) + 1 || 3001,
  serverOptions = {
    contentBase: 'http://' + host + ':' + port,
    quiet: true,
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
    publicPath: config.output.publicPath,
    headers: {"Access-Control-Allow-Origin": "*"},
    stats: {colors: true}
  },
  compiler = webpack(config, function(err, stats){
    var json = stats.toJson();
    if (json.errors.length)
      console.error(json.errors[0])
  }),
  webpackDevServer = new WebpackDevServer(compiler, serverOptions);


export default function (port) {
  if (config.environment === 'production') return;

  webpackDevServer.listen(port, '0.0.0.0', function (err) {
    if (err) return console.error(err);
    console.log(`webpack dev server listening on [ ${this.address().address}:${this.address().port} ]`);
  });
}
