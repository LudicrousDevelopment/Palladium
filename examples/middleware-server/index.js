const http = require("http");
const https = require("https");
const fs = require("fs");
const config = {
  "prefix": "/service/"
}

const Palladium = require("../../lib/server");
const Server = http.Server()

const proxy = new Palladium({
  prefix: config.prefix,
  encode: "xor",
  ssl: true,
  requestMiddleware: [
    Palladium.blackList(['example.org', 'among.us'], 'Site is Blocked by Host')
  ],
  debug: false,
})

/*proxy.onrequest((ctx) => {
  console.log('request', ctx.url)
})

proxy.onrequest((ctx) => {
  console.log('response', ctx.httpResponse.headers['content-type'] || '')
})*/

proxy.clientScript().ws(Server)

Server.on('request', (req, res) => {if(req.url.startsWith(proxy.prefix)){return proxy.request(req, res)}else{return res.end(fs.readFileSync(__dirname+'/index.html'))}})/*.on('upgrade', (req, socket, head) => proxy.upgrade(req, socket, head))*/.listen((process.env['PORT'] || config.port ||  8080), () => {console.log((proxy.ssl ? 'https' : 'http')+'://localhost:'+(process.env['PORT'] || config.port ||  8080))});