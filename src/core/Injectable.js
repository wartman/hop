import Stamp from './Stamp'

const DEPENDENCIES = Symbol('deps')

/**
 * Add dependencies to a Stamp.
 */
const Injectable = Stamp.init(function (options = {}, {stamp}) {
  const deps = Object.keys(stamp.$getDependencies())
  const injected = {}
  deps.forEach(key => {
    if (!options[key]) {
      throw new Error(`The dependency ${key} was not found`)
    }
    injected[key] = options[key]
  })
  Object.assign(this, injected)
}).statics({

  /**
   * Add dependencies
   *
   * @param {Obejct} ...deps
   * @returns {Stamp}
   */
  inject(...deps) {
    const dependencies = Object.assign(
      {}, 
      this.compose.staticProperties[DEPENDENCIES] || {}, 
      ...deps
    )
    return this.compose({
      staticProperties: {
        [DEPENDENCIES]: dependencies
      }
    })
  },

  /** 
   * Get dependencies for this Stamp.
   *
   * @returns {object}
   */
  $getDependencies() {
    return this.compose.staticProperties[DEPENDENCIES] || {}
  }

}).compose({

  staticPropertyDescriptors: {
    
    /**
     * Marks this as a stamp with dependencies.
     *
     * @var {boolean}
     */
    $isInjectable: {
      value: true,
      writeable: false,
      enumerable: false
    }

  }

})

export default Injectable
