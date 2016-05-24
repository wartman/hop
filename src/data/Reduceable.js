import Stamp from '../core/Stamp'

const TYPE_NAME = Symbol('type-name')

/**
 * A simple way to handle basic reducers.
 *
 *    const Foo = Reduceable.type('foo')
 *  
 */
const Reduceable = Stamp.statics({

  /**
   * Set the type of action this Reduceable should check.
   *
   * @param {string} name
   * @return {Stamp}
   */
  type(name) {
    return this.compose({
      propertyDescriptors: {
        [TYPE_NAME]: {
          value: name,
          writeable: false,
          enumerable: true
        }
      }
    })
  },

  /**
   * Convenience method to override the default handler.
   *
   * @param {Function} handle
   * @return {Stamp}
   */
  handler(handle) {
    return this.methods({handle})
  }

}).methods({

  getType() {
    return this[TYPE_NAME]
  },

  /**
   * Update the state if the action type matches this Reduceable's type.
   *
   * @param {Object} state
   * @param {Object} action
   * @return {Object}
   */
  handle(state = null, action) {
    if (action.type === this.getType()) {
      // todo:
      // Should intelligently handle data merging?
      return action.data
    }
    return state
  }

}).compose({

  propertyDescriptors: {
    
    /**
     * Marks this as a reduceable.
     *
     * @var {boolean}
     */
    $isReduceable: {
      value: true,
      writeable: false,
      enumerable: false
    }

  }

})

export default Reduceable
