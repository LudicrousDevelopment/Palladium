module.exports = class {
  constructor(ctx) {
    return function SSJS(text) {
      /*return `
      (function (window) {
        ${text}
      }(_window));
      `*/return text
    }
  }
}