/**
 * Check if this is an object. Returns `false` for null and array.
 *
 * @param {mixed} obj
 * @returns {boolean}
 */
export function isObject(obj) {
  const type = typeof obj;
  return !!obj && (type == 'object' || type == 'function');
}

/**
 * Check if this is a function.
 *
 * @param {mixed} obj
 * @return {boolean}
 */
export function isFunction(obj) {
  const tag = isObject(obj) ? Object.prototype.toString.call(obj) : ''
  return tag === '[object Function]' || tag === '[object GeneratorFunction]'
}

/**
 * Internal function to recursively assign properties to an object.
 *
 * @param {Object} obj
 * @param {Object} src
 * @returns {Object}
 */
function _deepAssign(obj, src) {
  for (let key in src) {
    if (src.hasOwnProperty(key)) {
      let val = src[key]
      if (Array.isArray(val)) {
        if (!Array.isArray(obj[key])) obj[key] = []
        obj[key] = obj[key].concat(val)
      } else if (isObject(val)) {
        if (!isObject(obj[key]) || Array.isArray(obj[key])) obj[key] = {}
        _deepAssign(obj[key], val)
      } else if (val !== undefined) {
        obj[key] = val
      }
    }
  }
  return obj
}

/**
 * Recursively assign properties to an object.
 *
 * @param {Object} dest
 * @param {Object} ...objs
 * @returns {Object}
 */
export function deepAssign(dest, ...objs) {
  objs.filter(obj => {
    return obj != null && obj != undefined
  }).forEach(obj => {
    _deepAssign(dest, obj)
  })
  return dest
}

const OBJECT_ID = Symbol('OBJECT_ID')

/**
 * Generate a unique ID to identify an object.
 *
 * @param {Object} obj
 * @returns {Symbol}
 */
export const ensureObjectId = (() => {
  let currentId = 0
  return obj => {
    if (obj[OBJECT_ID] != null) return obj[OBJECT_ID]
    obj[OBJECT_ID] = Symbol(currentId++)
    return obj[OBJECT_ID]
  }
})()

/**
 * Get an objects unique ID
 *
 * @param {Object} obj
 * @returns {Symbol | null}
 */
export const getObjectId = obj => {
  return obj[OBJECT_ID]
}
