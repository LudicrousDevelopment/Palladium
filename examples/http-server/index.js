const http = require("http");
const https = require("https");
const fs = require("fs");

const Palladium = require("../../lib/server");
const Server = http.Server()

const proxy = new Palladium({
  prefix: "/service/",
  encode: "plain",
  ssl: true,
})

proxy.clientScript().ws(Server)

Server.on('request', (req, res) => {if(req.url.startsWith(proxy.prefix)){return proxy.request(req, res)}else{return res.end(fs.readFileSync(__dirname+'/index.html'))}}).on('upgrade', (req, socket, head) => proxy.upgrade(req, socket, head)).listen(8080);