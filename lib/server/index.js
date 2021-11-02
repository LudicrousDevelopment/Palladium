var makeRequest = require('./request'),
  gateway = require('./gateway'),
  utilities = require('./utility'),
  fs = require('fs'),
  Compile = require('./compile'),
  handleRequest = require('./handleRequest'),
  querystring = require('querystring'),
  WebSocket = require('ws'),
  Upgrade = require('./websocket'),
  btoa = str => new Buffer.from(str).toString('base64'),
  atob = str => new Buffer.from(str, 'base64').toString('utf-8');

module.exports = class Smoke {
  constructor(config) {
    var defaults = {
      prefix: '/service/',
      encode: 'plain',
      ssl: false,
      requestMiddleware: [],
      title: 'Service'
    }
    this.config = defaults
    if (config.prefix) {
      if (config.prefix.startsWith('/') && config.prefix.endsWith('/'));
      else {
        config.prefix = config.prefix.replace(/\//g, '')
        config.prefix = '/'+config.prefix+'/'
      }
    }
    defaults = Object.assign(defaults, config);
    Object.entries(defaults).forEach((entry) => {
      this[entry[0]] = entry[1]
    })
    this.encoding = require('../encoding.js')(this)
    this.makeRequest = makeRequest
    this.handleRequest = handleRequest
    this.gateway = gateway
    this.middleware = {force: utilities.force}
    this.rewrite = new Compile(this)
    this.upgrade = new Upgrade(this)
    this.headersURL = (url) => {return this.encoding.decode(url.replace(this.prefix, ''))}
    this.getRequestUrl = (req) => {
      return this.encoding.decode(req.url.split(this.prefix)[1].replace(/\/$/g, '').replace(/^https:\/([a-z1-9A-Z])/g, "https://$1"))
    }
  }
  request(req, res, next = () => res.end('')) {
    if (!req.url.startsWith(this.prefix)) return next()

    if (req.url.startsWith(this.prefix+'gateway')) return new this.gateway(this).create(req, res)

    this.url = this.getRequestUrl(req)
    var requestConfig = {}
    Object.entries(this).forEach((entry) => {
      requestConfig[entry[0]] = entry[1]
    })

    this.req = req
    this.response = res
    
    if (req.url.replace(this.prefix, '').startsWith('index')) {
      return res.writeHead(200, {'content-type': 'application/javascript'}).end(fs.readFileSync('./lib/client/index.js', 'utf-8'))
    } else if (req.url=='/surf/index') console.log('ierfwdc')

    this.handleRequest(req, res, this)
    
    //new this.makeRequest(this).request(this)
  }
  express(smoke) {
    return function(req, res, next) {
      return smoke.request(req, res, next)
    }
  }
  clientScript() {
    var data1 = fs.readFileSync('./lib/encoding.js')
    var data2 = fs.readFileSync('./lib/client/xml.js')
    var data3 = fs.readFileSync('./lib/server/utility.js')
    var data4 = fs.readFileSync('./lib/client/client.js')
    var data5 = fs.readFileSync('./lib/rewrites/base.js')
    var data6 = fs.readFileSync('./lib/client/location.js')
    var data7 = fs.readFileSync('./lib/client/element.js')

    var fullData = [data4, data1, data2, data3, data5, data6, data7]
    fs.writeFileSync('./lib/client/index.js', fullData.join('\n'))
    console.log('Client Script Bundled')
    return this
  }
  ws(server) {
    new WebSocket.Server({server: server}).on('connection', (cli, req) => {

      var queryParams = querystring.parse(req.url.split('?').splice(1).join('?')), proxyURL, options = { 
          headers: {},
          followRedirects: true
      }, protocol = [];
  
      if (!queryParams.ws) return cli.close();
  
      proxyURL = this.encoding.decode(queryParams.ws);
  
      try { new URL(proxyURL) } catch{ return cli.close() };
  
      Object.entries(req.headers).forEach(([header_name, header_value]) => {
        if (header_name == 'sec-websocket-protocol') header_value.split(', ').forEach(proto => protocol.push(proto));
        if (header_name.startsWith('cf-') || header_name.startsWith('cdn-loop'));
        else if (!header_name.startsWith('sec-websocket'))  options.headers[header_name] = header_value;
      })
  
      if (queryParams.origin) (options.origin = this.encoding.decode(queryParams.origin), options.headers.origin = this.encoding.decode(queryParams.origin));        
  
      delete options.headers['host'];
      delete options.headers['cookie'];
  
      if (typeof this.config.localAddress == 'object' &&  this.config.localAddress.length != 0) options.localAddress = this.config.localAddress[Math.floor(Math.random() * this.config.localAddress.length)];

      const proxy = new WebSocket(proxyURL, protocol, options),
        before_open = [];
  
      if (proxy.readyState == 0) cli.on('message', data => before_open.push(data));
  
      cli.on('close', () => proxy.close());
      proxy.on('close', () => cli.close());
      cli.on('error', () => proxy.terminate())
      proxy.on('error', () => cli.terminate());
  
      proxy.on('open', () => {
        if (before_open.length != 0) before_open.forEach(data => proxy.send(JSON.stringify(data)))
        cli.on('message', data => proxy.send(JSON.stringify(data)));
        proxy.on('message', data => cli.send(JSON.stringify(data)));
      });
    });
  }
}

//module.exports = Smoke