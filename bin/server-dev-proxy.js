#!/usr/bin/env node

/*
  Development Proxy
  =================
  This proxy exposes only one port to outside of the container.
  Since in development environemnt is used two servers (app and webpack-dev)
  and dockito-proxy allows specify only one port per container.

  IMPORTANT: Must be used only in development environment.
 */

// enables ES6 support
require('../compiler');


/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

// if (__DEVELOPMENT__) {
//   if (!require('piping')({
//       hook: true,
//       ignore: /(\/\.|~$|\.json|\.scss$)/i
//     })) {
//     return;
//   }
// }


/* eslint no-var:0, vars-on-top:0 */
var http = require('http');
var httpProxy = require('http-proxy');
var serverApp = require('../src/server');
var serverWebpackDev = require('../webpack/webpack-dev-server');
var config = require('../src/config');


function onError(proxyName, err, req) {
  console.log('Proxy', proxyName, 'url [', req.url, '] error: ', err);
}


var proxyApp = httpProxy.createProxyServer({
  target: 'http://localhost:' + config.http.portBehindDevProxy
});


var proxyWebpackDev = httpProxy.createProxyServer({
  target: 'http://localhost:' + config.webpack.dev.port,
  ws: true
});


proxyApp.on('error', onError.bind(null, 'proxyApp'));
proxyWebpackDev.on('error', onError.bind(null, 'proxyWebpackDev'));


var serverProxy = http.createServer(function onProxy(req, res) {
  if (/^\/(dist|socket\.io)\/.*/.test(req.url)) {
    return proxyWebpackDev.web(req, res);
  }
  proxyApp.web(req, res);
});


serverProxy.on('upgrade', function onUpgrade(req, socket, head) {
  proxyWebpackDev.ws(req, socket, head);
});


serverProxy.listen(config.http.port, function onListening(err) {
  if (err) throw err;

  console.log('proxy listening on ' + this.address().address + ':' + this.address().port);
  serverApp(config.http.portBehindDevProxy);
  serverWebpackDev(config.webpack.dev.port);
});
