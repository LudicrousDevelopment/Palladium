var pConfig = JSON.parse(document.currentScript.getAttribute('data-config'))

var module = {}

if (pConfig.title) {
  document.title = pConfig.title
  setInterval(() => {if (document.title!==pConfig.title) document.title = pConfig.title}, 100)
}

