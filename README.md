# Palladium
Secondary Web Proxy to the Likes of Womginx and Corrosion.

Made by EnderKingJ

## Hosting Services
<a href="https://heroku.com/deploy?template=https://github.com/LudicrousDevelopment/Palladium" title="Deploy to Heroku"><img alt="Deploy to Heroku" src="https://raw.githubusercontent.com/QuiteAFancyEmerald/HolyUnblockerPublic/master/views/assets/img/heroku.svg?raw" width="140" height="30"><img></a>
&nbsp;
<a href="https://azuredeploy.net/" title="Deploy to Azure"><img alt="Deploy to Azure" src="https://raw.githubusercontent.com/QuiteAFancyEmerald/HolyUnblockerPublic/master/views/assets/img/azure.svg?raw" width="140" height="30"><img></a>
&nbsp;
<a href="https://repl.it/github/LudicrousDevelopment/Palladium" title="Run on Repl.it"><img alt="Run on Repl.it" src="https://raw.githubusercontent.com/QuiteAFancyEmerald/HolyUnblockerPublic/master/views/assets/img/replit.svg?raw" width="140" height="30"><img></a>
&nbsp;
<a href="https://glitch.com/edit/#!/import/github/LudicrousDevelopment/Palladium" title="Remix on Glitch"><img alt="Remix on glitch" src="https://raw.githubusercontent.com/QuiteAFancyEmerald/HolyUnblockerPublic/master/views/assets/img/glitch.svg?raw" width="140" height="30"><img></a>

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
const Palladium = require("palladiumub");

const proxy = new Palladium(); //default config

const http = require("http");
```
### Config
```js
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
const Palladium = require("palladiumub");

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