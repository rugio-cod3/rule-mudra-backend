Object.defineProperty(Number.prototype, 'str', {
  get: function () {
    return String(this)
  },
  configurable: true,
})
