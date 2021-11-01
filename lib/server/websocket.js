module.exports = class WebSocket {
  constructor(ctx) {
    this.ctx = ctx
    return (req, socket, head) => {
      try {
          var url = ctx.getRequestUrl(req.url)
          urlData.value = new URL(urlData.value);
          const requestContext = {
              url: urlData.value,
              flags: urlData.flags,
              body: null,
              headers: { ...clientRequest.headers },
              method: clientRequest.method, 
              rewrite: ctx,
              agent: new (urlData.value.protocol == 'https:' ? https : http).Agent({
                  rejectUnauthorized: false,
              }),
              address: null,
              req,
              socket,
              head,
          };
          (requestContext.url.protocol == 'https:' ? https : http).request({
              headers: requestContext.headers,
              method: requestContext.method,
              hostname: requestContext.url.hostname,
              port: requestContext.url.port,
              path: requestContext.url.pathname + requestContext.url.search,
              agent: requestContext.agent,
              localAddress: requestContext.address,
          }).on('upgrade', (rres, rsocket, rhead) => {
              let handshake = 'HTTP/1.1 101 Web Socket Protocol Handshake\r\n';
              for (let key in rres.headers) {
                  handshake += `${key}: ${rres.headers[key]}\r\n`;
              };
              handshake += '\r\n';
              socket.write(handshake);
              socket.write(remoteHead);
              rsocket.on('close', () => socket.end());
              socket.on('close', () => rsocket.end());
              rsocket.on('error', () => clientSocket.end());
              socket.on('error', () => rsocket.end());
              rsocket.pipe(clientSocket);
              socket.pipe(rsocket);
          }).on('error', () => {
              socket.end()
          }).end();
      } catch(err) {
          socket.end();
      };  
    }
  }
}