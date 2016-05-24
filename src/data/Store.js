import Stamp from '../core/Stamp'
import combineReducers from './combineReducers'

/**
 * Private symbols
 */
const REDUCERS = Symbol('reducers')
const REDUCER_HANDLER = Symbol('reduce')
const STATE = Symbol('state')
const LISTENERS = Symbol('listeners')
const IS_DISPATCHING = Symbol('is-dispatching')

/**
 * A store that holds the state tree. There should be only a single store in your app, and
 * the only way to change its state is to call `dispatch` on it.
 */
const Store = Stamp.init(function ({initialState}={}) {
  if (!this[REDUCERS]) {
    throw new Error('Cannot initialize a store without a reducer')
  }
  this[REDUCER_HANDLER] = combineReducers(this[REDUCERS])
  this[STATE] = initialState || {}
  this[LISTENERS] = []
  this[IS_DISPATCHING] = false
}).methods({

  /**
   * Run the registered reducer.
   *
   * @param {Object} state - The current state
   * @param {Object} action - The action being dispatched
   * @return {Object} - The new state.
   */
  reduce(state, action) {
    return this[REDUCER_HANDLER](state, action)
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
  reduces(reducers) {
    const prevReducers = this.compose.properties
      ? this.compose.properties[REDUCERS] || {}
      : {}
    return this.compose({
      properties: {
        [REDUCERS]: Object.assign({}, prevReducers, reducers)
      }
    })
  }

})

export default Store
