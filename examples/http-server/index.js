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
  debug: false,
  server: Server,
})

proxy.init()

Server.on('request', (req, res) => {if(req.url.startsWith(proxy.prefix)){return proxy.request(req, res)}else{return res.end(fs.readFileSync(__dirname+'/index.html'))}}).listen((process.env['PORT'] || config.port ||  8080), () => {console.log((proxy.ssl ? 'https' : 'http')+'://localhost:'+(process.env['PORT'] || config.port ||  8080))});