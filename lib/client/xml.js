const oFetch = window.fetch,
  oXHR = window.XMLHttpRequest.prototype.open,
  oPMessage = window.postMessage,
  oSBeacon = window.Navigator.prototype.sendBeacon;

var ctx = {
  prefix: config.prefix,
  url: config.url,
  config: {
    encode: config.encode,
  },
  encode: config.encode,
  getRequestUrl: (req) => {return this.encoding.decode(req.url.split(defaults.prefix)[1].replace(/\/$/g, ''))},
}

ctx.encoding = encoding(ctx)

window.fetch = function(url, opts) {
  if (url) url = new Base(ctx).url(url)
  return oFetch.apply(this, arguments)
}

window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
  if (url) url = new Base(ctx).url(url)
  console.log(url)
  return oXHR.apply(this, arguments)
}

window.postMessage = function(msg, origin, transfer) {
  if (origin) origin = location.origin;
  return oPMessage.apply(this, arguments);
};
window.Navigator.prototype.sendBeacon = function(url, data) {
  if (url) url = new Base(ctx).url(url);
  return oSBeacon.apply(this, arguments);
};

window.WebSocket = new Proxy(window.WebSocket, {
  construct(target, args) {
    console.log(args[0])
    if (args[0].includes('?')) var todo = '&'; else var todo = '?'
    args[0] = (location.protocol=='https:' ? 'wss:' : 'ws:') + '//' + location.origin.split('/').splice(2).join('/') + config.prefix + '?ws='+args[0].replace(location.origin.split('/').splice(2).join('/'), pLocation.origin.split('/').splice(2).join('/'))+ todo+'origin=' + new URL(config.url).origin;
    //console.log((location.protocol=='https:' ? 'wss:' : 'ws:') + '//' + location.origin.split('/').splice(2).join('/') + config.prefix + '?ws=' + ctx.encoding.encode(args[0].replace('ws', 'http')) + '&origin=' + new URL(config.url).origin)
    return Reflect.construct(target, args);
  }
});

/*

var lStorageOrigin = window.localStorage

Object.defineProperty(window, 'localStorage', {
  get() {
    return lStorageOrigin
  },
  set(value) {
    lStorageOrigin = value
  }
})

Object.keys(window.localStorage).forEach(key => {
  if (key.startsWith(new URL(config.url).hostname)) {
    localStorage[key] = localStorage[key]
  } else {
    var nkey = localStorage[key]
    //localStorage.removeItem(key)
    window.addEventListener('beforeunload', () => {
      localStorage[key] = nkey
    })
  }
})
/*
Object.defineProperty(window.localStorage, 'setItem', {

})

window.localStorage.getItem = new Proxy(window.localStorage.getItem, {
  apply(target, thisArg, args) {

  }
})*/

window.RTCPeerConnection = new Proxy(RTCPeerConnection, {
  construct(target, args) {
    if (args[1].urls.startsWith('turns:')) {
      args[1].username += `|${args[1].urls}`;
      args[1].urls = `turns:${location.host}`;
      return Reflect.apply(...arguments);
    } else if (args[1].urls.startsWith('stuns'))
      console.warn("STUN connections aren't supported!");
  }
});