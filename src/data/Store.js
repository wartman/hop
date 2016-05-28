import Stamp from '../core/Stamp'
import Injectable from '../core/Injectable'
import Container from '../core/Container'
import { isFunction } from '../core/util'

/**
 * Private symbols
 */
const REDUCERS = Symbol('reducers')
const UPDATES = Symbol('updates')
const STATE = Symbol('state')
const LISTENERS = Symbol('listeners')
const IS_DISPATCHING = Symbol('is-dispatching')

function getProperty(props, name, def={}) {
  if (!props || !props[name]) return def
  return props[name]
}

/**
 * A store that holds the state tree. There should be only a single store in your app, and
 * the only way to change its state is to call `dispatch` on it.
 */
const Store = Injectable.inject({
  app: Container
}).init(function ({initialState}={}) {
  if (this[UPDATES]) {
    this[UPDATES].forEach(stamp => this.attachUpdate(stamp))
  }
  if (!this[REDUCERS]) {
    throw new Error('Cannot initialize a store without a reducer')
  }
  this[REDUCERS] = Object.assign({}, this[REDUCERS])
  this[STATE] = initialState || {}
  this[LISTENERS] = []
  this[IS_DISPATCHING] = false
}).methods({

  /**
   * Connect reducers. Works the same as the static method.
   *
   * @param {Object} reducers
   */
  connect(reducers) {
    this[REDUCERS] = Object.assign({}, this[REDUCERS], reducers)
    return this
  },

  /**
   * Attach an Update to this Store.
   *
   * @param {Stamp|object} update - Can either be an instance OR a stamp.
   *                                Passing in a stamp is preferred, as it will
   *                                be created using dependency injection.
   * @return {this}
   */
  attachUpdate(update) {
    if (Stamp.isStamp(update)) {
      update = this.app.make(update)
    }
    if (!isFunction(update.attachTo)) {
      throw new Error('Cannot attach an Update without an `attachTo` method')
    }
    update.attachTo(this)
    this[update.getType()] = update
    return this
  },

  /**
   * Run the registered reducers.
   *
   * @param {Object} state - The current state
   * @param {Object} action - The action being dispatched
   * @return {Object} - The new state.
   */
  reduce(state, action) {
    const reducers = this[REDUCERS]
    const updatedState = {}
    let hasChanged = false

    Object.keys(reducers).forEach(key => {
      const reducer = reducers[key]
      const previousResource = state[key]
      const updatedResource = reducer(previousResource, action)
      if ('undefined' === typeof updatedResource) {
        throw new Error(
          `Given action ${action.type}, reducer "${key}" returned undefined. ` +
          `To ignore an action, you must explicitly return the previous state.`
        )
      }
      updatedState[key] = updatedResource
      hasChanged = hasChanged || previousResource !== updatedResource
    })
    return hasChanged ? updatedState : state
  },

  /**
   * Get the current state.
   *
   * @return {Object}
   */
  getState() {
    return this[STATE]
  },

  /**
   * Add a change listener, to be called on every dispatch.
   *
   * @param {Function} listener
   * @return {Function} - A function that can be called to remove the listener.
   */
  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listeners must be functions')
    }
    this[LISTENERS].push(listener)
    let isSubscribed = true
    return () => {
      if (!isSubscribed) return
      isSubscribed = false
      const index = this[LISTENERS].indexOf(listener)
      this[LISTENERS].splice(index, 1)
    }
  },

  /**
   * Dispatch an action. The exact handling of the action depends on the `reduce`
   * method. This will also fire off ALL listeners.
   *
   * @param {Object} action - A plain JS object. Must have at least a `type` property.
   * @return {this}
   */
  dispatch(action) {
    if (typeof action.type === 'undefined') {
      throw new Error('Actions MUST have a "type" property')
    }
    if (this[IS_DISPATCHING]) {
      throw new Error('Actions may not be dispatched by reducers')
    }

    try {
      this[IS_DISPATCHING] = true
      this[STATE] = this.reduce(this[STATE], action)
    } finally {
      this[IS_DISPATCHING] = false
    }

    const listeners = this[LISTENERS]
    listeners.forEach(listener => listener())

    return this
  }

}).statics({

  /**
   * Register a list of reducers the State should handle.
   *
   * Reducers are NOT composed until the State is initialized, meaning you
   * can add more reducers to the stamp.
   *
   * @param {Object} reducers - Functions or Reduceables
   * @return {Stamp}
   */
  connect(reducers) {
    const props = this.compose.properties
    return this.compose({
      properties: {
        [REDUCERS]: Object.assign({}, getProperty(props, REDUCERS), reducers)
      }
    })
  },

  updates(...updates) {
    const props = this.compose.properties
    return this.compose({
      properties: {
        [UPDATES]: getProperty(props, UPDATES, []).concat(updates)
      }
    })
  }

})

export default Store
