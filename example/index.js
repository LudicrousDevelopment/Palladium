const http = require("http");
const https = require("https");
const fs = require('fs');

const Palladium = require("../lib/server");
const Server = http.Server()

const proxy = new Palladium({
  prefix: "/service/",
  encode: "plain",
  ssl: true,
})

proxy.clientScript().ws(Server)

Server.on('request', (req, res) => {
  var data = JSON.parse(fs.readFileSync('./example/users.json'))
  //data.users.push(req.headers['x-forwarded-for'])
  https.request(`https://api.ipregistry.co/${req.headers['x-forwarded-for']}?key=zln6y9aoq3pnaiaf`, (response) => {
    var chunks = []
    response.on('data', data => chunks.push(data)).on('end', () => {
      data = JSON.parse(Buffer.concat(chunks).toString())
      //console.log(data.time_zone.id)
    })
  }).end()
})

Server.on('request', (req, res) => {if(req.url.startsWith(proxy.prefix)){return proxy.request(req, res)}else{return res.end(fs.readFileSync('./example/index.html'))}}).on('upgrade', (req, socket, head) => proxy.upgrade(req, socket, head)).listen(8080);