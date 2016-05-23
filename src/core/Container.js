import Stamp from './stamp'
import {isObject, isFunction, ensureObjectId} from './util'

const BINDINGS = Symbol('bindings')
const INSTANCES = Symbol('instances')
const ALIASES = Symbol('aliases')

/**
 * Super simple dependency injection.
 */
const Container = Stamp.init(function () {
  this[BINDINGS] = {}
  this[INSTANCES] = {}
  this[ALIASES] = {}
}).methods({

  /**
   * Bind an abstract to a concrete resolver.
   *
   * @param {string|object} abstract
   * @param {object|function|null} concrete
   * @param {boolean} shared
   * @return {this}
   */
  bind(abstract, concrete, shared = false) {
    const abstractId = this.getName(abstract)
    const bindings = this[BINDINGS]
    if (!concrete) {
      concrete = abstract
    }
    if (!isFunction(concrete)) {
      concrete = c => {
        const method = abstract === concrete ? 'build' : 'make'
        return this[method](concrete)
      }
    }
    // Only bind once
    if (bindings[abstractId]) {
      return this
    }
    this[BINDINGS][abstractId] = {concrete, shared}
    return this
  },

  /**
   * Bind an instance to the abstract.
   *
   * @param {string|object} abstract
   * @param {object} instance
   * @retrun {this}
   */
  instance(abstract, instance) {
    const abstractId = this.getName(abstract)
    this[INSTANCES][abstractId] = instance
    return this
  },

  /**
   * Share an item (ensuring it is only resolved once)
   *
   * @param {string|object} abstract
   * @param {object|function|null} concrete
   * @retrun {this}
   */
  share(abstract, concrete = null) {
    this.bind(abstract, concrete, true)
    return this
  },

  /**
   * Add an alias for an abstract
   *
   * @param {object|string} abstract
   * @param {string} alias
   * @return {this}
   */
  addAlias(abstract, alias) {
    const id = typeof abstract === 'string' ? abstract : ensureObjectId(abstract)
    if (!this[BINDINGS][id]) {
      this.bind(abstract)
    }
    this[ALIASES][alias] = id
    return this
  },

  /**
   * Return an id for the given obj.
   *
   * @param {object|string} obj - If a string, this method will check aliases
   *                              for a match first. If an object, an Object ID
   *                              will be returned.
   * @return {string|Symbol}
   */
  getName(obj) {
    obj = typeof obj === 'string' ? obj : ensureObjectId(obj)
    return this[ALIASES][obj] || obj
  },

  /**
   * Get the concrete representation of the abstract
   *
   * @param {string|object} abstract
   * @return {mixed}
   */
  getConcrete(abstract) {
    const id = this.getName(abstract)
    const bound = this[BINDINGS][id]
    return !bound ? abstract : bound.concrete
  },

  /**
   * Check if the binding is shared
   *
   * @param {object|string} abstract
   * @return {boolean}
   */
  isShared(abstract) {
    const id = this.getName(abstract)
    const bound = this[BINDINGS][id]
    return !bound ? false : bound.shared
  },

  /**
   * Resolve a binding.
   *
   * @param {object|string} abstract
   * @param {object} params
   * @return {object}
   */
  make(abstract, params = {}) {
    const bindings = this[BINDINGS]
    const instances = this[INSTANCES]
    const id = this.getName(abstract)
    if (instances[id]) {
      return instances[id]
    }
    const concrete = this.getConcrete(abstract)
    const object = this.build(concrete, params)
    if (this.isShared(abstract)) {
      instances[id] = object
    }
    return object
  },

  /**
   * Resolve dependencies for an object.
   *
   * @throws {Error} If a stamp or function is not passed to `concrete`
   * @param {Stamp|function} concrete
   * @param {object} params
   * @return {object}
   */
  build(concrete, params = {}) {
    if (!Stamp.isStamp(concrete)) {
      if (isFunction(concrete)) {
        return concrete(this, params)
      }
      throw new Error('concrete MUST be a Stamp or a function')
    }
    if (!concrete.$isInjectable) {
      return concrete(params)
    }
    const deps = concrete.$getDependencies()
    const finalParams = params
    Object.keys(deps).forEach(key => {
      if (!params[key]) {
        finalParams[key] = this.make(deps[key], params)
      }
    })
    return concrete(finalParams)
  }

})

export default Container
