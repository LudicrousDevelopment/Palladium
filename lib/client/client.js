var config = JSON.parse(document.currentScript.getAttribute('data-config'))

var module = {}

if (config.title) document.title = config.title

console.log(config)

