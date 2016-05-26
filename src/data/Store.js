import Stamp from '../core/Stamp'
import CombineReducers from './CombineReducers'

/**
 * Private symbols
 */
const REDUCERS = Symbol('reducers')
const UPDATES = Symbol('updates')
const REDUCER_HANDLER = Symbol('reduce')
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
const Store = Stamp.init(function ({initialState}={}) {
  if (!this[REDUCERS]) {
    throw new Error('Cannot initialize a store without a reducer')
  }
  if (this[UPDATES]) {
    this[UPDATES].forEach(update => {
      update.attachTo(this)
      this[update.getType()] = update
    })
  }
  this[REDUCER_HANDLER] = CombineReducers(this[REDUCERS])
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
    if(action.$sent) {
      console.warn(
        'An action was already sent! Remember, you don\'t need to pass' +
        'an action to `dispatch` if it\'s been attached to a Store.'
      )
      return this
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
    const reducers = {}
    const props = this.compose.properties
    updates.forEach(update => {
      reducers[update.getType()] = update
    })
    return this.compose({
      properties: {
        [REDUCERS]: Object.assign({}, getProperty(props, REDUCERS), reducers),
        [UPDATES]: getProperty(props, UPDATES, []).concat(updates)
      }
    })
  }

})

export default Store
