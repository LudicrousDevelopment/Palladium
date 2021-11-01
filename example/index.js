const http = require("http");
const https = require("https");

const fs = require('fs');

const Smoke = require("../lib/server");
const Server = http.Server()

var proxy = new Smoke({
  encode: "xor",
  ssl: true,
})

proxy.clientScript().ws(Server)

Server.on('request', (req, res) => {
  if (req.url.startsWith(proxy.prefix)) {
    return proxy.request(req, res)
  } else {
    return res.end(fs.readFileSync(__dirname+'/'+'index.html', 'utf-8'))
  }
}).listen(8080);