module.exports = class {
  constructor(ctx) {
    return function(ctx) {
      var options = {
        headers: {

        },
        method: ctx.req.method
      }
      if (ctx.req.headers['referer']) options.headers['referer'] = ctx.headers.referer(ctx.req.headers['referer'])

      if (ctx.req.headers['origin']) options.headers['origin'] = ctx.headers.origin(ctx.req.headers['origin'], ctx.url)
      
      if (ctx.req.headers['user-agent']) options.headers['user-agent'] = ctx.req.headers['user-agent']

      if (ctx.req.headers['authorization']) options.headers['authorization'] =ctx.req.headers['authorization']

      if (ctx.req.headers['cookie']) options.headers['cookie'] = ctx.headers.cookie(ctx.req.headers['cookie'])

      if (ctx.req.headers['accept']) options.headers['accept'] = ctx.req.headers['accept']

      if (ctx.req.headers['content-type']) options.headers['content-type'] = ctx.req.headers['content-type']

      if (ctx.req.headers['content-length']) options.headers['content-length'] = ctx.req.headers['content-length']

      if (ctx.req.headers['accept-language']) options.headers['accept-language'] = ctx.req.headers['accept-language']

      Object.entries(ctx.req.headers).forEach(([header, value]) => {
        if (header.startsWith('x-')||header.startsWith('sec-')) options.headers[header] = value
      })
      return options
    }
  }
}