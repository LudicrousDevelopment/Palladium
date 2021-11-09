class JSRewriter {
  constructor(data, ctx) {
    return function JS(data, ctx) {
      return data.toString().replace(/location\.href/gi, 'pLocation.href').replace('myScript=scripts[index]||', 'myScript=').replace(/location\s*=\s*/gi, 'PLocation = ')
    }
  }
}

if (typeof module !== undefined) module.exports = JSRewriter