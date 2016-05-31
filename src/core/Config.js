import Stamp from './Stamp'

/**
 * Configuration store.
 */
const Config = Stamp.init(function (options={}) {
  this.$data = new Map()
  Object.keys(options).forEach(key => {
    this.$data.set(key, options[key])
  })
}).methods({

  /**
   * Set an option.
   *
   * @param {string} key
   * @param {mixed} value
   * @returns {this}
   */
  set(key, value) {
    this.$data.set(key, value)
    return this
  },

  /**
   * Get an option. If the option is not set, you can provide a fallback value
   * as the second param.
   *
   * @param {string} key
   * @param {mixed} def
   * @returns {mixed}
   */
  get(key, def=null) {
    return this.$data.has(key) ? this.$data.get(key) : def
  },

  /**
   * Check if a key exists
   *
   * @param {string} key
   * @return {boolean}
   */
  has(key) {
    return this.$data.has(key)
  },

  /**
   * Remove a key
   *
   * @param {string} key
   * @return {this}
   */
  delete(key) {
    this.$data.delete(key)
    return this
  }

})

export default Config
