import Stamp from '../core/Stamp'
import { isFunction, isObject } from '../core/util'

const ANONYMOUS = '<<anonoymous>>'
const DESCRIPTION = Symbol('description')

/**
 * Check if the given value is a shape.
 *
 * @param {mixed} shape
 *
 * @return {bool}
 */
export function isShape(shape) {
  return isObject(shape) && isFunction(shape.validate)
}

/**
 * Get the basic type of a given value.
 *
 * @param {mixed} obj
 *
 * @return {string}
 */
function getType(obj) {
  if (Array.isArray(obj)) {
    return 'array'
  }
  const type = typeof obj
  if (type instanceof RegExp) {
    return 'object'
  }
  return type
}

/**
 * Get the type of a value, handling edge-cases.
 *
 * @param {mixed} obj
 *
 * @return {string}
 */
function getPreciseType(obj) {
  const type = getType(obj)
  if (type === 'object') {
    if (obj instanceof Date) {
      return 'date';
    } else if (obj instanceof RegExp) {
      return 'regexp';
    }
  }
  return type
}

/**
 * An internal stamp that checks a value's type.
 */
const TypeChecker = Stamp.compose({

  propertyDescriptors: {

    isRequired: {
      get() {
        this._isRequired = true
        return this
      }
    }

  }

}).methods({

  /**
   * Validate the given properties.
   *
   * @param {object} props
   * @param {string} key
   * @param {string} parentName
   * @param {string} propFullName
   *
   * @return {Error|null}
   */
  validate(props, key, parentName, propFullName) {
    const err = this._exists(props, key, parentName, propFullName)
    if (err) {
      return err
    }
    const value = props[key]
    const type = getType(value)
    const expectedType = this.expectedType
    if (type !== expectedType && type !== 'undefined') {
      const preciseType = getPreciseType(value)
      return new Error(
        `Invalid \`${propFullName}\` of type ` +
        `\`${preciseType}\` supplied to \`${parentName}\`, expected ` +
        `\`${expectedType}\``
      )
    }
    if (isFunction(this._validateInnerShape)) {
      return this._validateInnerShape(props, key, parentName, propFullName)
    }
    return null
  },

  /**
   * Check if the given key exists in the given props.
   *
   * @param {object} props
   * @param {string} key
   * @param {string} parentName
   * @param {string} propFullName
   *
   * @return {Error|null}
   */
  _exists(props, key, parentName, propFullName) {
    if (this._isRequired && props[key] == null) {
      return new Error(
        `Required \`${propFullName}\` was not specified in \`${parentName}\``
      )
    }
    return null
  }

})

const StringType = TypeChecker.properties({
  expectedType: 'string'
})

const NumberType = TypeChecker.properties({
  expectedType: 'number'
})

const FunctionType = TypeChecker.properties({
  expectedType: 'function'
})

const BooleanType = TypeChecker.properties({
  expectedType: 'boolean'
})

const ArrayType = TypeChecker.properties({
  expectedType: 'array'
}).methods({

  /**
   * Describe the internal shape of this array.
   *
   * @param {mixed} shape
   *
   * @return {this}
   */  
  of(shape) {
    if (!isShape(shape)) {
      shape = ObjectType().of(shape)
    }
    this._innerShape = shape
    return this
  },

  check(arr, parentName=null) {
    if (!parentName) {
      parentName = 'array'
    }
    if (!Array.isArray(arr)) {
      return new Error(
        `Invalid type \`${getType(arr)}\` supplied to \`${parentName}\`, expected an array`
      )
    }
    const innerShape = this._innerShape
    for (let i = 0; i < arr.length; i++) {
      let error = innerShape.validate(arr, i, parentName, `${parentName}[${i}]`)
      if (error) return error
    }
    return null
  },

  _validateInnerShape(props, key, parentName, propFullName) {
    if (!this._innerShape) {
      return null
    }
    const value = props[key]
    const innerShape = this._innerShape
    if (!Array.isArray(value)) {
      return new Error(
        `Invalid \`${propFullName}\` of type ` +
        `\`${getType(value)}\` supplied to \`${parentName}\`, expected an array`
      )
    }
    for (let i = 0; i < value.length; i++) {
      let error = innerShape.validate(value, i, parentName, `${propFullName}[${i}]`)
      if (error) { 
        return error
      }
    }
    return null
  }

})

const ObjectType = TypeChecker.properties({
  expectedType: 'object'
}).methods({

  /**
   * Describe the internal shape of this object.
   *
   * @param {object} shape
   *
   * @return {this}
   */  
  of(shape) {
    if (!isObject(shape)) {
      throw new Error('ObjectType.of expects an object')
    }
    this._innerShape = shape
    return this
  },

  check(obj, parentName=null) {
    if (!this._innerShape) {
      return null
    }
    if (!parentName) parentName = obj.name || typeof obj
    const keys = Object.keys(this._innerShape)
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let typeChecker = this._innerShape[key]
      let error = typeChecker.validate(obj, key, parentName, `${parentName}[${key}]`)
      if (error) return error
    }
    return null
  },

  _validateInnerShape(props, key, parentName, propFullName) {
    return this.check(props[key], `${parentName}[${key}]`)
  }

})

const Shape = Stamp.compose({

  staticPropertyDescriptors: {

    string: {
      get() {
        return StringType()
      },
      enumerable: false,
      configurable: false,
      writeable: false
    },

    number: {
      get() {
        return NumberType()
      },
      enumerable: false,
      configurable: false,
      writeable: false
    },

    bool: {
      get() {
        return BooleanType()
      },
      enumerable: false,
      configurable: false,
      writeable: false
    },

    func: {
      get() {
        return FunctionType()
      },
      enumerable: false,
      configurable: false,
      writeable: false
    },

    object: {
      get() {
        return ObjectType()
      },
      enumerable: false,
      configurable: false,
      writeable: false
    },

    array: {
      get() {
        return ArrayType()
      },
      enumerable: false,
      configurable: false,
      writeable: false
    }

  }

}).init(function ({expectedShape}) {
  if (expectedShape) {
    this[DESCRIPTION] = Array.isArray(expectedShape)
      ? ArrayType().of(expectedShape)
      : ObjectType().of(expectedShape)
  }
}).methods({

  check(obj, parentName=null) {
    return this[DESCRIPTION].check(obj, parentName)
  }

})

export default Shape
