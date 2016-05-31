import {deepAssign} from './util'

const assign = Object.assign
const defineProperties = Object.defineProperties
const isFunction = (obj) => 'function' === typeof obj
const isObject = (obj) => !!obj && ('function' === typeof obj || 'object' === typeof obj)
const isDescriptor = (obj) => isObject(obj)

/**
 * Creates new factory instance.
 *
 * @param {object} descriptor The information about the object the factory will be creating.
 * @returns {Function} The new factory function.
 */
function createFactory(descriptor) {
  return function Stamp(options, ...args) {
    let obj = Object.create(descriptor.methods || {})

    deepAssign(obj, descriptor.deepProperties)
    assign(obj, descriptor.properties)
    defineProperties(obj, descriptor.propertyDescriptors || {})

    if (!descriptor.initializers || descriptor.initializers.length === 0) return obj

    return descriptor.initializers.filter(isFunction).reduce((resultingObj, initializer) => {
      const returnedValue = initializer.call(resultingObj, options,
        {instance: resultingObj, stamp: Stamp, args: [options].concat(args)})
      return returnedValue === undefined ? resultingObj : returnedValue
    }, obj)
  }
}

/**
 * Returns a new stamp given a descriptor and a compose function implementation.
 *
 * @param {object} [descriptor={}] The information about the object the stamp will be creating.
 * @param {Function} composeFunction The "compose" function implementation.
 * @returns {Function}
 */
function createStamp(descriptor, composeFunction) {
  const Stamp = createFactory(descriptor)

  deepAssign(Stamp, descriptor.staticDeepProperties)
  assign(Stamp, descriptor.staticProperties)
  defineProperties(Stamp, descriptor.staticPropertyDescriptors || {})

  const composeImplementation = isFunction(Stamp.compose) ? Stamp.compose : composeFunction
  Stamp.compose = function () {
    return composeImplementation.apply(this, arguments)
  };
  assign(Stamp.compose, descriptor)

  return Stamp
}

/**
 * Mutates the dstDescriptor by merging the srcComposable data into it.
 *
 * @param {object} dstDescriptor The descriptor object to deepAssign into.
 * @param {object} [srcComposable] The composable (either descriptor or stamp) to deepAssign data form.
 * @returns {object} Returns the dstDescriptor argument.
 */
function mergeComposable(dstDescriptor, srcComposable) {
  const srcDescriptor = (srcComposable && srcComposable.compose) || srcComposable
  if (!isDescriptor(srcDescriptor)) return dstDescriptor

  const combineProperty = (propName, action) => {
    if (!isObject(srcDescriptor[propName])) return
    if (!isObject(dstDescriptor[propName])) dstDescriptor[propName] = {}
    action(dstDescriptor[propName], srcDescriptor[propName])
  }

  combineProperty('methods', assign)
  combineProperty('properties', assign)
  combineProperty('deepProperties', deepAssign)
  combineProperty('propertyDescriptors', assign)
  combineProperty('staticProperties', assign)
  combineProperty('staticDeepProperties', deepAssign)
  combineProperty('staticPropertyDescriptors', assign)
  combineProperty('configuration', assign)
  combineProperty('deepConfiguration', deepAssign)

  if (Array.isArray(srcDescriptor.initializers)) {
    dstDescriptor.initializers = srcDescriptor.initializers.reduce((result, init) => {
      if (isFunction(init) && result.indexOf(init) < 0) { // ensure initializers are not repeated
        result.push(init)
      }
      return result
    }, Array.isArray(dstDescriptor.initializers) ? dstDescriptor.initializers : [])
  }

  return dstDescriptor
}

/**
 * Compose two or more descriptors together.
 *
 * Adheres to https://github.com/stampit-org/stamp-specification
 * (and is based closely on the reference implementation found here:
 * https://github.com/stampit-org/stamp-specification)
 *
 * @param {Composable} ...composables
 * @return {Stamp}
 */
export default function Compose(...composables) {
  const descriptor = [this].concat(composables).filter(isObject).reduce(mergeComposable, {});
  return createStamp(descriptor, Compose)
}
