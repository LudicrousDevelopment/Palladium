const express = require('express')
const app = express()

const Server = require('http').Server(app)

const Smoke = new (require('../../lib/server'))({
  prefix: '/service/',
  encode: 'plain',
  ssl: true,
})

app.use(express.static(__dirname+'/', {extensions: ['html']}))

app.use(Smoke.express(Smoke, Server))

Server.listen(8080)