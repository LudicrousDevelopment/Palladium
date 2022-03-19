# This Proxy has been Archived.

Please visit the new and better proxy, [Rhodium](https://github.com/LudicrousDevelopment/Rhodium)

# Palladium
Secondary Web Proxy to the Likes of Womginx and Corrosion.

Made by EnderKingJ

## Hosting Services
<a href="https://heroku.com/deploy?template=https://github.com/LudicrousDevelopment/Palladium"><img height="30px" src="https://raw.githubusercontent.com/FogNetwork/Tsunami/main/deploy/heroku2.svg"><img></a>
<a href="https://repl.it/github/LudicrousDevelopment/Palladium"><img height="30px" src="https://raw.githubusercontent.com/FogNetwork/Tsunami/main/deploy/replit2.svg"><img></a>
<a href="https://glitch.com/edit/#!/import/github/LudicrousDevelopment/Palladium"><img height="30px" src="https://raw.githubusercontent.com/FogNetwork/Tsunami/main/deploy/glitch2.svg"><img></a>

## Speed (Discord)
### Palladium is the fastest proxy, severely beating Corrosion by 3x, Alloy - No Discord Support, Womginx - 1.3x

## Done
- hCaptcha Support
- Discord Support
- Reddit Support
- Websocket Support
- Cookie Rewrites

## To-Do
- Better HTML Rewriter
- Better JS Rewriter
- Better Cookie Support
- LocalStorage Proxying
- More Native Browser Functions
- Better Headers Code
- Single File Version
- Youtube UI Fix

## Supported Sites
### Github
Supported + Login (Some Parts of Dashboard Unsupported
### Discord
Supported
### Reddit
Mostly Supported
### Youtube
Somewhat Supported, Errors: Reddit bug, can play video but navigating to other pages requires opening in new tab

## Setup
### Importing and Initiating
```js
const Palladium = require("palladiumub"); //Outdated package, change to lib/server folder path

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
  ],
  Corrosion: [false, {}]
  server: your-http-server
}
```
### Server
```js
var server = http.createServer();

proxy.init();

server.on("request", (req, res) => {
  if (req.url.startsWith(proxy.prefix)) return proxy.request(req, res)
  res.end("<form action='/service/gateway' method='POST'><input name='url'><input type='submit'></form>")
})
```
### End Result
`index.js`
```js
const Palladium = require("palladiumub");

const http = require("http");

var server = http.createServer();

const proxy = new Palladium({
  "prefix": "/service/",
  "encode": "xor",
  "title": "Service",
  "requestMiddleware": [
    Palladium.blackList(["any-link.com", "accounts.google.com"], "Page is Blocked by Host")
  ],
  server: server,
});

proxy.init();

server.on("request", (req, res) => {
  if (req.url.startsWith(proxy.prefix)) return proxy.request(req, res)
  res.writeHead(200, {'content-type': 'text/html'}).end("<form action='/service/gateway' method='POST'><input name='url'><input type='submit'></form>")
})

server.listen(8080)
```
