var https = require('https'),
  http = require('http')

module.exports = class {
  constructor(con) {
    return function(ctx) {
      var text = ctx.decompress(ctx.httpResponse, ctx.arrayData)
      Object.entries(ctx.httpResponse.headers).forEach(([header_name, header_value]) => {
          if (header_name == 'set-cookie') {
              const cookie_array = [];
              header_value.forEach(cookie => cookie_array.push(cookie.replace(/Domain=(.*?);/gi, `Domain=` + req.headers['host'] + ';').replace(/(.*?)=(.*?);/, '$1' + '@' + new URL(ctx.url).hostname + `=` + '$2' + ';')));
              ctx.httpResponse.headers[header_name] = cookie_array;
  
          };
  
          if (header_name.startsWith('content-encoding') || header_name.startsWith('x-') || header_name.startsWith('cf-') || header_name.startsWith('strict-transport-security') || header_name.startsWith('content-security-policy') || header_name.startsWith('content-length')) delete ctx.httpResponse.headers[header_name];
  
          if (header_name == 'location') ctx.httpResponse.headers[header_name] = new ctx.rewrite.Base(ctx).url(header_value)
      });
      var con = (ctx.httpResponse.headers['content-type']||'').split(';')[0]
      if (con=='text/css') {
        text = ctx.rewrite.CSSRewriter(text.toString('utf-8'), ctx)
      } else if (ctx.httpResponse.headers['content-type']) {
        if (ctx.httpResponse.headers['content-type'].startsWith('application/javascript')) {
          text = ctx.rewrite.JSRewriter(text.toString('utf-8'), ctx)
        }
        if (ctx.httpResponse.headers['content-type'].startsWith('text/html')) {
          text = ctx.rewrite.HTMLRewriter(text.toString('utf-8'), ctx)
        }
      }
      if(ctx.httpResponse.headers['content-type'] && ctx.httpResponse.headers['content-type'].match(/text\/html\s*$/g)) {
        ctx.httpResponse.headers['content-type'] += '; charset=UTF-8'
      }
      ctx.response.writeHead(ctx.httpResponse.statusCode, ctx.httpResponse.headers).end(text)
    }
  }
}