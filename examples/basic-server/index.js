const Palladium = require('./palladium-bundle'),
  proxy = new Palladium({encode:'xor',ssl:true,debug:false}),
  Server = require('http').Server().on('request', (req, res) => {if(req.url.startsWith(proxy.prefix)) return proxy.request(req, res);else res.writeHead(200,{'content-type': 'text/html'}).end('<center><form method="POST" action="/service/gateway"><input name="url"><br><input type="submit"></form></center>')}).listen(8080)

proxy.ws(Server)