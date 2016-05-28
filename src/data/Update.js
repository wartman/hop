import Stamp from '../core/Stamp'
import { isFunction } from '../core/util'
import Shape from './Shape'

const TYPE = Symbol('type')
const ACTIONS = Symbol('actions')
const STORE = Symbol('store')
const SHAPE = Symbol('shape')
// const ENV = process ? process.env.NODE_ENV || 'development' : 'development'
const ENV = 'development'

/**
 * Defines actions and the reducers that should handle them.
 */
const Update = Stamp.properties({
  
  [TYPE]: 'none',
  [ACTIONS]: {}

}).methods({

  /**
   * Get the type this action should be bound to. This will map to the
   * matching key in any Store this Update is registered with.
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
   *    const Foo = Update.type('foo').actions({
   *      increment: Action((state) => state++)
   *    })
   *
   * To run the bound reducer, you'd pass the following action:
   *
   *    const foo = Foo()
   *    foo.reduce(1, {type: 'foo.increment'}) // -> "2"
   *
   * This makes more sense if you're using the Update in a Store:
   *
   *    const foo = Foo()
   *    const store = Store.updates(foo).new({foo: 1})
   *    store.dispatch({type: 'foo.increment'}) // -> "2"
   *    // However, theres a better way to do this! We've attached our Update
   *    // to a store, so it'll automatically dispatch when we call an action:
   *    foo.increment() // -> "3"
   *    // it's also now a property on `store`:
   *    store.foo.increment() // -> "4"
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
   * Attach this Update and all its actions to a store.
   *
   * @param {Store} store
   * @return {this}
   */
  attachTo(store) {
    this[STORE] = store
    store.connect({
      [this.getType()]: (state, action) => this.reduce(state, action)
    })
    return this
  },

  /**
   * Is this update is attached to a Store, this method will return the current state of
   * the property the Update is managing.
   *
   * @return {Object}
   */
  getState() {
    if (!this[STORE]) {
      throw new Error('The Update must be attached to a store before it can be used.')
    }
    return this[STORE].getState()[this.getType()]
  },

  /**
   * Format an action and dispatch on the attached Store.
   *
   * @param {String} actionName
   * @param {Array} payload
   * @return {this}
   */
  $sendAction(actionName, payload) {
    if (!this[STORE]) {
      throw new Error('The Update must be attached to a store before it can be used.')
    }
    if (!this.$hasAction(actionName)) {
      throw new Error(`The action ${actionName} does not exist`)
    }
    this[STORE].dispatch(this.$formatAction(actionName, payload))
    return this
  },

  $formatAction(actionName, payload) {
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
   * @throws {Error} - If an the returned state has the wrong Shape and this is
   *                   not in production mode.
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
    const updatedState = reduce.apply(this, args)

    if (this[SHAPE] && ENV !== 'production') {
      const error = this[SHAPE].check(updatedState, 'store.'+this.getType())
      if (error) throw error
    }

    return updatedState
  },

  /**
   * Parses a payload object into an array.
   *
   * This uses the `params` property for the matching action. For example,
   * say we've done this:
   *
   *    const Foo = Update.type('foo').actions({
   *      bar: {
   *        params: ['key'],
   *        reducer(state, key) { return Object.assign({}, state, {key}) }
   *      }
   *    })
   *
   * (the above is the same as doing `bar: Action('key', (state, key) => Object.assign({}, state, {key}))`)
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
   * Add sub-actions to the Update.
   *
   * Each added action will automatically add a method to the Stamp that
   * returns a parsed action object. For example:
   *
   *    const Foo = Update.type('foo').actions({
   *      bar: {
   *        params: ['key'],
   *        reducer(state, key) { return Object.assign({}, state, {key})}
   *      }
   *    })
   *
   * Calling `foo.bar('bin')` will return `{type: 'foo.bar', payload: {key: 'bin'}}`
   *
   * All actions expect an object with the signature `{params: Array, reducer: Function}`. You
   * can write this object by hand or use the `Action` function to create one for you.
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
  },

  /**
   * Define the expected shape for the updated resource.
   *
   * If provided, this Update will throw an error if an invalid shape is returned
   * from a reducer (for performance, this is only done in dev mode).
   *
   * @param {Object|Shape} shape
   * @return {Stamp}
   */
  shape(shape) {
    if (!isFunction(shape.check)) {
      shape = Shape({expectedShape: shape})
    }
    return this.compose({
      properties: {
        [SHAPE]: shape
      }
    })
  }

})

/**
 * Define an action binding. The last argument MUST be a function and will
 * be used as the reducer.
 *
 * @param {mixed} ...params
 * @return {Object}
 */
function Action(...params) {
  const reducer = params.pop()
  return {params, reducer}
}

export default Update
export {Action}
