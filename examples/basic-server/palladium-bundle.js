var rurl = require('url')
var http = require('http')
var https = require('https')
var fs = require('fs')
var { JSDOM } = require('jsdom')
var regex = /(src|href|action|integrity|nonce|http-equiv)\s*=\s*['`"](.*?)['"`]/gi

var encoding = (ctx) => {
  switch (ctx.encode) {
    case "plain":
      return {
        encode(str) {
          return str;
        },
        decode(str) {
          return str;
        }
      }
      break;
    case "xor":
      return {
        encode(str) {
          return (encodeURIComponent(str.split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join('')));
        },
        decode(str) {
          if (!str.startsWith('hvtrs')) return str
          return (decodeURIComponent(str).split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''))
        }
      }
      break;
    case "base64":
      return {
        encode(str) {
          return new Buffer.from(str).toString("base64");
        },
        decode(str) {
          if (new Buffer.from(str).toString("base64").startsWith('http')) {
            return str
          }
          return new Buffer.from(str, "base64").toString("utf-8");
        }
      }
      break;
    default:
      return {
        encode(str) {
          return str;
        },
        decode(str) {
          return (str.split('https:/').startsWith('/') ? str : str.replace('https:/', 'https://'));
        }
      }
  }
}

if (typeof module !== undefined) module.exports = encoding;

const clientscript = fs.readFileSync('./examples/basic-server/client.js', 'utf-8')

var gateway = eval(class {
  constructor(ctx) {
    Object.entries(ctx).forEach((entry) => {
      this[entry[0]] = entry[1]
    })
    this.ctx = ctx
  }
  create(req, res) {
    if (req.url.startsWith(this.config.prefix + 'gateway')) {
      var pdata = []
      req.on('data', data => pdata.push(data))
      req.on('end', () => {
        var string = Buffer.concat(pdata).toString()
        if (string === '') {
          if (!new URLSearchParams(urlp.parse(req.url, true).query).get('url')) return res.writeHead(500, { refresh: '5; /' }).end('Missing Parameter: URL')
          var url = new URLSearchParams(urlp.parse(req.url, true).query).get('url')
        } else {
          if (!new URLSearchParams(string).get('url')) return res.writeHead(500, { refresh: '5; /' }).end('Missing Parameter: URL')
          var url = new URLSearchParams(string).get('url')
        }
        if (!url.startsWith('http')) url = 'https:\/' + url

        url = url.replace(/http(s|):\/([a-zA-Z0-9]+)/g, 'https:/\/\/\/\/\\//$2')
        url = this.ctx.encoding.encode(url);
        res.writeHead(301, { location: `${this.prefix}${url}/` }).end('')
        console.log(url)
      })
    } else {
      res.writeHead(500, { refresh: '5; /' }).end('Unknown Error')
    }
  }
}),
  utilities = {},
  Compile = class {
    constructor(ctx) {
      return {
        Base: class Base {
          constructor(ctx) {
            this.ctx = ctx
          }
          url(url, ext) {
            url = url.replace(/^\/\//g, 'https://')

            try { url = url.replace(location.origin, new URL(ctx.url).origin) } catch{ }

            /*if (url.includes('https://')) {
              url = url.replace('https://', '')
              url = url.split('/')
              url[0] = ''
              Object.keys(url).forEach((e) => {
                if (!e==0||!e==1) url[e]='/'+url[e]
              })
              url = url.join('')
              console.log(url)
            }*/
            if (!this.ctx.encode === 'base64') {
              url = this.ctx.encoding.decode(url)
            }
            if (url.startsWith(this.ctx.prefix)) return url
            if (!url.startsWith('http')) {
              try {
                var host = new URL(this.ctx.url).hostname
              } catch (err) {
                try { var host = new URL(this.ctx.encoding.decode(this.ctx)).hostname } catch (e) { }
              }
              url = 'https://' + host + (url.startsWith('/') ? '' : '/') + url
            }
            if (new URL(url).protocol.startsWith('ws')) {
              console.log(new URLSearchParams(new URL(url).search))
            }

            if (url.includes('https://')) url = url.replace('https://', 'https:/')
            if (!ext) return this.ctx.prefix + this.ctx.encoding.encode(url) + '/'
            return this.ctx.prefix + ext + this.ctx.encoding.encode(url) + '/'
          }
          element(attr, ext) {
            if (ext === '_plain/') {
              var url = this.url(attr)
            } else {
              var url = this.url(attr, ext)
            }

            return url
          }
        },
        Main: class Main {
  constructor(ctx) {
    var newctx = ctx.req.url.replace(ctx.prefix, '/').replace(/\/_(.*)\/(.*)/, (m, p1, p2) => {return [p1, ctx.encoding.decode(p2)]}).split(',')
    ctx.url = newctx[1]
    var contentt;
    switch(newctx[0]) {
      case "js":
        ctx.response.headers = {'content-type': 'application/javascript; charset=UTF-8'}
        break;
      case "css":
        ctx.response.headers = {'content-type': 'text/css; charset=UTF-8'}
        break;
      case "xhr":
        break;
      case "img":
        ctx.response.headers = {'content-type': mime.lookup(rurl.parse(req.url, true).pathname)}
        break;
    }
    return new ctx.makeRequest(ctx)
  }
},
        HTMLRewriter: new (class HTMLRewriter {
  constructor(data, ctx) {
    return function HTML(data, ctx) {
      ctx.responseText = data.toString()

      var rewriteData = {
        tags: ['src', 'srcset', 'href'],
        removetags: ['intergity', 'nonce', 'http-equiv']
      }

      var injectData = {
        prefix: ctx.prefix,
        //encurl: ctx.encoding.decode(new ctx.rewrite.Base(ctx).url(ctx.url).replace(ctx.prefix, '')),
        url: ctx.url,
        title: ctx.title,
        encode: ctx.encode,
        req: {
          url: ctx.req.url,
        },
      }

      ctx.responseText = ctx.responseText.replace(regex, (match, p1, p2) => {
        if (p1=='integrity' || p1=='nonce' || p1=='http-equiv') return ''
        return `${p1}="${new ctx.rewrite.Base(ctx).url(p2)}" data-palladium="true"`
      })

      var html = new JSDOM(ctx.responseText, {'content-type': 'text/html'}), document = html.window.document;

      document.querySelectorAll('script').forEach((node) => {
        node.textContent ? node.textContent = ctx.rewrite.JSRewriter(node.textContent, ctx) : ''
      })

      rewriteData.removetags.forEach((tag) => {
        document.querySelectorAll(`*[${tag}]`).forEach((node) => {
          node.removeAttribute(tag)
        })
      })

      function InjectScript(){
        var e = document.createElement('script')
        e.setAttribute('data-config', JSON.stringify(injectData))
        e.src = injectData.prefix + 'index'
        document.querySelector('head').insertBefore(e, document.querySelector('head').childNodes[0])
      }

      InjectScript()

      ctx.responseText = html.serialize()
      return html.serialize()
    }
  }
})(ctx),
        CSSRewriter: new (class CSSRewriter {
  constructor(data, ctx) {
    return function CSS(data, ctx) {
      return data.toString()
    }
  }
})(ctx),
        JSRewriter: new (class JSRewriter {
  constructor(data, ctx) {
    return function JS(data, ctx) {
      return data.toString().replace(/(window|document)\.location/gi, '$1.pLocation').replace('myScript=scripts[index]||', 'myScript=').replace(/location\s*=\s*/gi, 'PLocation = ').replace(/location\.([a-zA-Z0-9]*)/gi, 'pLocation.$1')//.replace(/\.href\s*=(["'` ]*)([a-zA-Z0-9]*)(['`" ]*)/gi, (match, p1, p2, p3) => {return '.phref = '+p1+new ctx.rewrite.Base(ctx).url(p2)+p3})
    }
  }
})(ctx),
        CookieRewriter: class CookieRewriter {
  constructor(ctx) {
    if (!ctx.requestResponse.headers['cookie']) return {};
    else console.log(ctx.requestResponse.headers['cookie'])
  }
},
        RewriteHeaders: class RewriteHeaders {
  constructor(ctx) {
    if (ctx.requestResponse.headers.location) ctx.requestResponse.headers.location = new ctx.rewrite.Base(ctx).url(ctx.requestResponse.headers.location);
    ['content-length','content-security-policy','content-security-policy-report-only','strict-transport-security','x-frame-options'].forEach(name => delete ctx.requestResponse.headers[name]);
    return ctx.requestResponse.headers
  }
},
      }
    }
  },
  handleRequest = function Smoke(req, res, ctx) {
    Object.assign(this, ctx)
    var proxy = { host: (this.getRequestUrl(req).replace(/(https:\/\/|http:\/\/|\/$)/g, '')).split('/')[0], path: (this.getRequestUrl(req)).split('/')[(this.getRequestUrl(req)).split('/').length - 1], url: this.getRequestUrl(req), docTitle: this.config.docTitle }

    /*if (ctx.url.match(/https:\/\/(www|)\.youtube\.com\/watch\?v=[a-z1-9A-Z](.*)\//g)) {
      return res.writeHead(301, {location: ctx.prefix+'gateway?url='+ctx.url}).end('')
    }*/

    proxy.options = {
      headers: {},
      method: req.method,
    };

    if (req.headers['referer']) proxy.options['referer'] = /*ctx.headers.referer(*/req.headers['referer']//)

    if (req.headers['origin']) proxy.options['origin'] = /*ctx.headers.origin(*/req.headers['origin']//, ctx.url)

    /*if (req.headers.referer) {
      try {
        var ourl = req.url
        req.url = req.headers.referer
        req.headers.referer = new URL(ctx.getRequestUrl(req)).href;
        req.url = ourl
      } catch(err) {
        req.headers.referer = new URL(ctx.url).href;
      };
    };*/

    //if (req.headers['cookie']) proxy.options['cookie'] = req.headers['cookie']

    try { new URL(proxy.url) } catch (err) { return res.end('Invalid URL: ' + proxy.url + ', ' + err) }

    proxy.spliceURL = new URL(proxy.url)

    var inject = { url: ctx.url, prefix: ctx.prefix, host: new URL(ctx.url).hostname }

    /*if (proxy.options.headers['cookie']) {        
      var array = [],
      newCookie = proxy.options.headers['cookie'].split('; ');
      newCookie.forEach(cookie => {
        var cname = cookie.split('=')+''
        var cvalue = cookie.split('=')+''
        if (proxy.spliceURL.hostname.includes(cookie.split('@').splice(1).join())) array.push(cname.split('@').splice(0, 1).join() + '=' + cvalue);
      });
      proxy.options.headers['cookie'] = array.join('; ');
    };*/

    var requestProtocol = proxy.url.startsWith('https') ? https : http

    if (ctx.url.endsWith(',jq.oar')) {
      ctx.url = ctx.url.replace(ctx.url.split('/')[ctx.url.split('/').length - 1], '').replace(/\/$/, '')
    }

    if (ctx.url.endsWith('.asq.oar')) {
      ctx.url = ctx.url.split('-')[0]
    }

    /*if (req.url.endsWith('/')) {
      return res.writeHead(301, {location: req.url.replace(/\/$/g, '')}).end('')
    }*/

    var requestMain = requestProtocol.request(ctx.url, proxy.options, response => {
      let pData = []
      let sendData = ''
      response.on('data', (data) => { pData.push(data) }).on('end', () => {

        Object.entries(response.headers).forEach(([header_name, header_value]) => {
          if (header_name == 'set-cookie') {
            const cookie_array = [];
            header_value.forEach(cookie => cookie_array.push(cookie.replace(/Domain=(.*?);/gi, `Domain=` + req.headers['host'] + ';').replace(/(.*?)=(.*?);/, '$1' + '@' + proxy.spliceURL.hostname + `=` + '$2' + ';')));
            response.headers[header_name] = cookie_array;

          };

          if (header_name.startsWith('content-encoding') || header_name.startsWith('x-') || header_name.startsWith('cf-') || header_name.startsWith('strict-transport-security') || header_name.startsWith('content-security-policy') || header_name.startsWith('content-length')) delete response.headers[header_name];

          if (header_name == 'location') response.headers[header_name] = new ctx.rewrite.Base(ctx).url(header_value)
        });

        sendData = Buffer.concat(pData)

        if (response.headers['content-type']) {
          if (response.headers['content-type'].startsWith('text/html')) {
            sendData = ctx.rewrite.HTMLRewriter(sendData.toString('utf-8'), ctx)
          } else if (response.headers['content-type'].startsWith('application/javascript')) {
            sendData = ctx.rewrite.JSRewriter(sendData.toString('utf-8'), ctx)
          } else if (response.headers['content-type'].startsWith('text/css')) {
            sendData = ctx.rewrite.CSSRewriter(sendData.toString('utf-8'), ctx)
          }
        }

        //if (sendData.includes('myScript')) fs.writeFileSync('./lib/client/discord-fix.js', sendData)

        if (response.headers['content-type'] && response.headers['content-type'].match(/text\/html$/g)) {
          response.headers['content-type'] += '; charset=UTF-8'
        }

        if (req.method === 'POST') delete response.headers['content-type']

        res.writeHead(response.statusCode, response.headers).end(sendData)
      })
    }).on('error', err => res.end('Error: ' + err))
    if (!res.writableEnded) {
      req.on('data', (data) => requestMain.write(data)).on('end', () => requestMain.end())
    } else {
      requestMain.end()
    }
  },
  qs = require('querystring'),
  ws = require('ws'),
  btoa = str => new Buffer.from(str).toString('base64'),
  atob = str => new Buffer.from(str, 'base64').toString('utf-8');

utilities.blackList = (ctx) => {
  if (ctx.middleware.blackList) {

  } else return ctx
}

utilities.force = (ctx) => {
  return ctx.url.replace(/http:\/\//g, 'https://');
}

class Palladium {
  constructor(config) {
    var defaults = {
      prefix: '/service/',
      encode: 'plain',
      ssl: false,
      requestMiddleware: [],
      title: 'Service',
      debug: false,
    }
    this.config = defaults
    if (config.prefix) {
      if (config.prefix.startsWith('/') && config.prefix.endsWith('/'));
      else {
        config.prefix = config.prefix.replace(/\//g, '')
        config.prefix = '/' + config.prefix + '/'
      }
    }
    defaults = Object.assign(defaults, config);
    Object.entries(defaults).forEach((entry) => {
      this[entry[0]] = entry[1]
    })
    this.encoding = encoding(this)
    this.handleRequest = handleRequest
    this.gateway = gateway
    this.middleware = { force: utilities.force }
    this.rewrite = new Compile(this)
    this.headersURL = (url) => { return this.encoding.decode(url.replace(this.prefix, '')) }
    this.getRequestUrl = (req) => {
      return this.encoding.decode(req.url.split(this.prefix)[1].replace(/\/$/g, '').replace(/^https:\/([a-z1-9A-Z])/g, "https://$1"))
    }
    this.headers = (class Headers {
      constructor(ctx) {
        return {
          origin(header, url) {
            console.log(new URL(url).origin)
            return new URL(url).origin
          },
          referer(header) {
            console.log(header)
            console.log(ctx.getRequestUrl({ url: header }))
            return ctx.getRequestUrl({ url: header })
          }
        }
      }
    })
  }
  request(req, res, next = function() { res.end('') }) {
    if (!req.url.startsWith(this.prefix)) return next()

    if (this.debug == true) console.log('Request', this.getRequestUrl(req))

    if (req.url.startsWith(this.prefix + 'gateway')) return new this.gateway(this).create(req, res)

    this.url = this.getRequestUrl(req)
    var requestConfig = {}
    Object.entries(this).forEach((entry) => {
      requestConfig[entry[0]] = entry[1]
    })

    this.req = req
    this.response = res

    this.headers = new (class Headers {
      constructor(ctx) {
        return {
          origin(header, url) {
            console.log(new URL(url).origin)
            return new URL(url).origin
          },
          referer(header) {
            console.log(header)
            console.log(ctx.getRequestUrl({ url: header }))
            return ctx.getRequestUrl({ url: header })
          }
        }
      }
    })(this)

    if (req.url.replace(this.prefix, '').startsWith('index')) {
      return res.writeHead(200, { 'content-type': 'application/javascript' }).end(clientscript)
    } else if (req.url == '/surf/index') console.log('ierfwdc')

    this.handleRequest(req, res, this)

    //new this.makeRequest(this).request(this)
  }
  express(smoke, server) {
    smoke.clientScript()
    smoke.ws(server)
    return function(req, res, next) {
      return smoke.request(req, res, next)
    }
  }
  clientScript(ctx) {
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
  ws(http) {
    new ws.Server({ server: http }).on('connection', (cli, req) => {

      var params = qs.parse(req.url.split('?').splice(1).join('?')), url, options = { headers: {}, followRedirects: true }

      var protocol = [];

      if (!params.ws) return cli.close();

      url = this.encoding.decode(params.ws);

      try { new URL(url) } catch { return cli.close() };

      Object.entries(req.headers).forEach(([name, value]) => {
        if (name == 'sec-websocket-protocol') value.split(', ').forEach(proto => protocol.push(proto));
        if (name.startsWith('cf-') || name.startsWith('cdn-loop'));
        else if (!name.startsWith('sec-websocket')) options.headers[name] = value;
      })

      if (params.origin) (options.origin = this.encoding.decode(params.origin), options.headers.origin = this.encoding.decode(params.origin));

      delete options.headers['host'];
      delete options.headers['cookie'];

      if (typeof this.config.localAddress == 'object' && this.config.localAddress.length != 0) options.localAddress = this.config.localAddress[Math.floor(Math.random() * this.config.localAddress.length)];

      console.log('Websocket Connection', url)

      const proxySocket = new ws(url, protocol, options)

      const chunks = [];

      if (proxySocket.readyState == 0) cli.on('message', data => chunks.push(data));

      proxySocket.on('error', () => console.log('websocket proxy error'))
      proxySocket.on('close', () => console.log('websocket proxy close'))
      cli.on('error', () => console.log('websocket client error'))
      cli.on('close', () => console.log('websocket client close'))

      cli.on('close', () => proxySocket.close());
      proxySocket.on('close', () => cli.close());
      cli.on('error', () => proxySocket.terminate())
      proxySocket.on('error', () => cli.terminate());

      proxySocket.on('open', () => {
        if (chunks.length != 0) chunks.forEach(data => proxySocket.send(JSON.stringify(data)))
        cli.on('message', data => proxySocket.send(JSON.stringify(data)));
        proxySocket.on('message', data => cli.send(JSON.stringify(data)));
      });
    });
    if (this.debug == true) console.log('Websocket Loaded')
    return this
  }
}

module.exports = Palladium