const http = require("http");
const https = require("https");
const fs = require("fs");
const config = {
  "prefix": "/surf/"
}

const Palladium = require("../../lib/server");
const Server = http.Server()

const Corrosion = new (require('../../corrosion-heroku/lib/server'))({
  codec: 'xor',
  prefix: '/service/',
  requestMiddleware: []
})

const proxy = new Palladium({
  prefix: config.prefix,
  encode: "plain",
  ssl: true,
  requestMiddleware: [
    Palladium.blackList(['example.org', 'among.us'], 'Site is Blocked by Host')
  ],
  debug: false,
  Corrosion: [true, Corrosion],
  server: Server,
})

proxy.init()

Server.on('request', (req, res) => {if(req.url.startsWith(proxy.prefix)){return proxy.request(req, res)}else if(req.url.startsWith(Corrosion.prefix))return Corrosion.request(req, res);else{return res.end(fs.readFileSync(__dirname+'/index.html'))}}).listen((process.env['PORT'] || config.port ||  8080), () => {console.log((proxy.ssl ? 'https' : 'http')+'://localhost:'+(process.env['PORT'] || config.port ||  8080))});