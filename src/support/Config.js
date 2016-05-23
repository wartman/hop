import Stamp from '../core/Stamp'

const Config = Stamp.init(function (options = {}) {
  this.$data = options
}).methods({

  set(key, value) {
    this.$data[key] = value
    return this
  },

  get(key, def=null) {
    return this.$data[key] || def
  },

  delete(key) {
    delete this.$data[key]
    return this
  },

  has(key) {
    return !!this.$data[key]
  }

})

export default Config
