# Palladium
Secondary Web Proxy to the Likes of Womginx and Corrosion.

Made by EnderKingJ

## Supported Sites
### Discord
Unsupported, Errors: QR Socket/Login POST Request
### Reddit
Somewhat Supported, Errors: Redirects to unoproxified URL but still works
### Youtube
Somewhat Supported, Errors: Reddit bug, can play video but navigating to other pages requires opening in new tab

## Setup
### Importing and Initiating
```js
const Palladium = require("./lib/server");

const proxy = new Palladium(); //default config

const http = require("http");
```
### Config
```json
{
  "prefix": "/service/",
  "ssl": true,
  "encode": "xor",
  "title": "Service",
  "requestMiddleware": [
    Palladium.blackList(["discord.com", "accounts.google.com"], "Page is Blocked by Host")
  ]
}
```
### Server
```js
var server = http.createServer();

proxy.clientScript().ws(server);

server.on("request", (req, res) => {
  if (req.url.startsWith(proxy.prefix)) return proxy.request(req, res)
  res.end("<form action='/service/gateway' method='POST'><input name='url'><input type='submit'></form>")
})
```
### End Result
`index.js`
```js
const Palladium = require("./lib/server");

const proxy = new Palladium({
  "prefix": "/service/",
  "ssl": true,
  "encode": "xor",
  "title": "Service",
  "requestMiddleware": [
    Palladium.blackList(["any-link.com", "accounts.google.com"], "Page is Blocked by Host")
  ]
});

const http = require("http");

var server = http.createServer();

proxy.clientScript().ws(server);

server.on("request", (req, res) => {
  if (req.url.startsWith(proxy.prefix)) return proxy.request(req, res)
  res.writeHead(200, {'content-type': 'text/html'}).end("<form action='/service/gateway' method='POST'><input name='url'><input type='submit'></form>")
})

server.listen(8080)
```