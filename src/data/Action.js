import Stamp from '../core/Stamp'

const TYPE = Symbol('type')
const ACTIONS = Symbol('actions')

/**
 * Defines actions and the reducers that should handle them.
 */
const Action = Stamp.properties({
  
  [TYPE]: 'none',
  [ACTIONS]: {}

}).methods({

  /**
   * Get the type this action should be bound to. This will map to the
   * matching key in any Store this Action is registered with.
   *
   * @return {string}
   */
  getType() {
    return this[TYPE]
  },

  /**
   * Run the reducer. Reducers are matched using a `type.action` syntax. For example,
   * take this action:
   *
   *    const Foo = Action.type('foo').actions({
   *      increment: Binding((state) => state++)
   *    })
   *
   * To run the bound reducer, you'd pass the following action:
   *
   *    const foo = Foo()
   *    foo.reduce(1, {type: 'foo.increment'}) // -> "2"
   *
   * This makes more sense if you're using the Action in a Store:
   *
   *    const foo = Foo()
   *    const store = Store.actions(foo).new({foo: 1})
   *    store.dispatch({type: 'foo.increment'}) // -> "2"
   *    // Alternately, we can use the `increment` method on our Foo action
   *    // (which just returns the same thing):
   *    store.dispatch(foo.increment()) // -> "3"
   *
   * @param {Object} state
   * @param {Object} action
   * @return {Object} - The updated state
   */
  reduce(state, action) {
    const type = this.getType()
    const [prefix, actionName] = action.type.split('.')

    if (type !== prefix) {
      return state
    }

    if (this.$hasAction(actionName)) {
      return this.$reduceForAction(actionName, state, action.payload)
    }
    return state
  },

  /**
   * Format an action.
   *
   * @param {String} actionName
   * @param {Array} payload
   * @return {Object}
   */
  $sendAction(actionName, payload) {
    if (!this.$hasAction(actionName)) {
      throw new Error(`The action ${actionName} does not exist`)
    }
    return {
      type: `${this.getType()}.${actionName}`,
      payload: this.$getObjectFromParamsForAction(actionName, payload)
    }
  },

  /**
   * Check if the action exists.
   *
   * @param {String} actionName
   * @return {Boolean}
   */
  $hasAction(actionName) {
    return !!this[ACTIONS][actionName]
  },

  /**
   * Run the matching reducer for the given action.
   *
   * @param {String} actionName
   * @param {Object} state
   * @param {Object} payload
   * @return {Object}
   */
  $reduceForAction(actionName, state, payload) {
    const args = this.$getParamsFromObjectForAction(actionName, payload)
    args.unshift(state)
    const reduce = this.$getReducerForAction(actionName)
    return reduce.apply(this, args)
  },

  /**
   * Parses a payload object into an array.
   *
   * This uses the `params` property for the matching action. For example,
   * say we've done this:
   *
   *    const Foo = Action.type('foo').actions({
   *      bar: {
   *        params: ['key'],
   *        reducer(state, key) { return Object.assign({}, state, {key}) }
   *      }
   *    })
   *
   * (the above is the same as doing `bar: Binding('key', (state, key) => Object.assign({}, state, {key}))`)
   *
   * Thus:
   *
   *    foo.$getParamsFromObjectForAction('bar', {key: 'bin'}) // -> ['bin']
   *
   * @param {String} actionName
   * @param {Object} payload
   * @return {Array}
   */
  $getParamsFromObjectForAction(actionName, payload) {
    const keys = this[ACTIONS][actionName].params
    return keys.map(key => payload[key])
  },

  /**
   * Does the opposite of $getParamsFromObjectForAction
   *
   * @param {String} actionName
   * @param {Array} params
   * @return {Object}
   */
  $getObjectFromParamsForAction(actionName, params) {
    if (!Array.isArray(params)) {
      params = [params]
    }
    const keys = this[ACTIONS][actionName].params
    const payload = {}
    params.forEach((value, index) => {
      const key = keys[index]
      if (key) {
        payload[key] = value
      }
    })
    return payload
  },

  /**
   * Get the reducer for the given action.
   *
   * @return {Function}
   */
  $getReducerForAction(actionName) {
    return this[ACTIONS][actionName].reducer
  }

}).statics({

  /**
   * Bind this action to a type. This maps to a matching property in the Store.
   * See `CombineReducers` for how this is handled.
   *
   * @param {String} name
   */
  type(name) {
    return this.compose({
      propertyDescriptors: {
        [TYPE]: {
          value: name,
          writeable: false,
          enumerable: true
        }
      }
    })
  },

  /** 
   * Add sub-actions to the Action.
   *
   * Each added action will automatically add a method to the Stamp that
   * returns a parsed action object. For example:
   *
   *    const Foo = Action.type('foo').actions({
   *      bar: {
   *        params: ['key'],
   *        reducer(state, key) { return Object.assign({}, state, {key})}
   *      }
   *    })
   *
   * Calling `foo.bar('bin')` will return `{type: 'foo.bar', payload: {key: 'bin'}}`
   *
   * All actions expect an object with the signature `{params: Array, reducer: Function}`. You
   * can write this object by hand or use the `Binding` function to create one for you.
   *
   * Another important note: `state` in the reducer is always the full property that the Action is
   * handling (`foo` in the above example).
   *
   * @param {Object} actions
   * @return {Stamp}
   */
  actions(actions) {
    const methods = {}
    Object.keys(actions).forEach(key => methods[key] = function (...payload) {
      return this.$sendAction(key, payload)
    })
    const prevActions = this.compose.properties[ACTIONS] || {}

    return this.compose({
      properties: {
        [ACTIONS]: Object.assign({}, prevActions, actions)
      },
      methods
    })
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

/**
 * Define an action binding. The last argument MUST be a function and will
 * be used as the reducer.
 *
 * @param {mixed} ...params
 * @return {Object}
 */
function Binding(...params) {
  const reducer = params.pop()
  return {params, reducer}
}

export default Action
export {Binding}
