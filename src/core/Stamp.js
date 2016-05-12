import Compose from './Compose'
import {isFunction, isObject as isDescriptor} from './util'

const assign = Object.assign

/**
 * Fluent interface for creating stamps.
 *
 * This is the only place where we deviate a bit from stampit and use
 * method names I prefer.
 */
const Stamp = Compose({

  staticProperties: {
    init(...initializers) {
      return this.compose({initializers: initializers.filter(isFunction)})
    },
    statics(...staticProperties) {
      return this.compose({staticProperties: assign({}, ...staticProperties)})
    },
    methods(...methods) {
      return this.compose({methods: assign({}, ...methods)})
    },
    properties(...properties) {
      return this.compose({properties: assign({}, ...properties)})
    },
    refs(...deepProperties) {
      return this.compose({deepProperties: assign({}, ...deepProperties)})
    },
    new(...args) {
      return this(...args)
    }
  }

})

/**
 * Check if this is a stamp. Not added as a static property to ensure
 * that it doesn't get mixed into child stamps.
 *
 * @param {mixed} obj
 * @return {boolean}
 */
Stamp.isStamp = function (obj) {
  return isFunction(obj) && isFunction(obj.compose) && isDescriptor(obj.compose)
}

export default Stamp
