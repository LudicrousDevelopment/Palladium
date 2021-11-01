class JSRewriter {
  constructor(data, ctx) {
    return function JS(data, ctx) {
      return data.toString().replace(/location/gi, 'sLocation')
    }
  }
}

if (typeof module !== undefined) module.exports = JSRewriter