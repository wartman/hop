import {deepAssign} from './util'

const assign = Object.assign
const defineProperties = Object.defineProperties
const isFunction = (obj) => 'function' === typeof obj;
const isObject = (obj) => !!obj && ('function' === typeof obj || 'object' === typeof obj)
const isDescriptor = (obj) => isObject(obj)

/**
 * Create a new stamp factory.
 *
 * @param {Object} composeMethod
 * @return {Stamp}
 */
const _createStamp = (composeMethod) => {
  const {
    methods, properties, deepProperties, propertyDescriptors, initializers,
    staticProperties, deepStaticProperties, staticPropertyDescriptors
  } = composeMethod
  const Stamp = function Stamp(options, ...args) {
    let obj = Object.create(methods || {})
    deepAssign(obj, deepProperties)
    assign(obj, properties)
    if (propertyDescriptors) defineProperties(obj, propertyDescriptors)
    if (Array.isArray(initializers)) {
      initializers.forEach(fn => {
        // todo: should handle promises
        const result = fn.call(obj, options, {
          instance: obj, stamp: Stamp, args: [options].concat(args)
        })
        if (result != null && result !== undefined) obj = result
      })
    }
    return obj
  }
  deepAssign(Stamp, deepStaticProperties)
  assign(Stamp, staticProperties)
  if (staticPropertyDescriptors) defineProperties(Stamp, staticPropertyDescriptors)
  Stamp.compose = composeMethod
  return Stamp
}

/**
 * Merge a descriptor into a new one
 *
 * @param {Object} dstDescriptor
 * @param {Object} src
 * @return {Object}
 */
function _mergeInComposable(dstDescriptor, src) {
  const srcDescriptor = (src && src.compose) || src
  if (!isDescriptor(srcDescriptor)) return dstDescriptor
  const combineDescriptorProperty = (propName, action) => {
    if (!isObject(srcDescriptor[propName])) return
    if (!isObject(dstDescriptor[propName])) dstDescriptor[propName] = {}
    action(dstDescriptor[propName], srcDescriptor[propName]);
  }
  combineDescriptorProperty('methods', assign)
  combineDescriptorProperty('properties', assign)
  combineDescriptorProperty('deepProperties', deepAssign)
  combineDescriptorProperty('staticProperties', assign)
  combineDescriptorProperty('deepStaticProperties', deepAssign)
  combineDescriptorProperty('propertyDescriptors', assign)
  combineDescriptorProperty('staticPropertyDescriptors', assign)
  combineDescriptorProperty('configuration', deepAssign)
  dstDescriptor.initializers = [].concat(dstDescriptor.initializers, srcDescriptor.initializers).filter(isFunction)
  return dstDescriptor
}

/**
 * Compose two or more descriptors together.
 *
 * Adheres to https://github.com/stampit-org/stamp-specification
 * (and is based closely on the reference implementation)
 *
 * @param {Composable} ...composables
 * @return {Stamp}
 */
function compose(...composables) {
  let composeMethod = function composeMethod(...args) {
    return compose(composeMethod, ...args)
  }
  composeMethod = composables.reduce(_mergeInComposable, composeMethod)
  return _createStamp(composeMethod)
}

/**
 * Fluent interface for creating stamps.
 *
 * This is the only place where we deviate a bit from stampit and use
 * method names I prefer.
 */
const Stamp = compose({

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

export {
  Stamp as default,
  Stamp,
  compose
}
