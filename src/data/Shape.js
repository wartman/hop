import Stamp from '../core/Stamp'

const ANONYMOUS = '<<anonoymous>>'
const DESCRIPTION = Symbol('description')

function getType(obj) {
  const type = typeof obj
  if (Array.isArray(obj)) {
    return 'array'
  }
  if (type instanceof RegExp) {
    return 'object'
  }
  return type
}

function getPreciseType(obj) {
  const type = getType(obj)
  if (type === 'object') {
    if (propValue instanceof Date) {
      return 'date';
    } else if (propValue instanceof RegExp) {
      return 'regexp';
    }
  }
  return type
}

const Requireable = Stamp.methods({

  require(toggle = true) {
    this.isRequired = toggle
    return this
  },

  validateExists(props, key, parentName, propFullName) {
    if (this.isRequired && props[key] == null) {
      return new Error(
        `Required \`${propFullName}\` was not specified in \`${parentName}\``
      )
    }
    return null
  }

})

const TypeChecker = Stamp.compose(
  Requireable
).init(function ({expectedType} = {}) {
  this.expectedType = expectedType
}).methods({

  validate(props, key, parentName, propFullName) {
    const err = this.validateExists(props, key, parentName, propFullName)
    if (err) return err

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
    return null
  }

})

const ArrayOfTypeChecker = Stamp.compose(
  Requireable
).init(function ({typeChecker} = {}) {
  this.typeChecker = typeChecker
}).methods({

  check(arr, parentName = null) {
    if (!parentName) parentName = arr.name || typeof arr
    if (!Array.isArray(arr)) {
      return new Error(
        `Invalid type \`${getType(arr)}\` supplied to \`${parentName}\`, expected an array`
      )
    }
    for (let i = 0; i < arr.length; i++) {
      const error = this.typeChecker.validate(arr, i, parentName, `${parentName}[${i}]`)
      if (error) return error
    }
    return null
  },

  validate(props, key, parentName, propFullName) {
    const err = this.validateExists(props, key, parentName, propFullName)
    if (err) return err

    const typeChecker = this.typeChecker
    if (!typeChecker && !typeChecker.validate) {
      return new Error(
        `Property \`${propFullName}\` of has invalid Type notation inside arrayOf.`
      )
    }
    const value = props[key]
    if (!Array.isArray(value)) {
      return new Error(
        `Invalid \`${propFullName}\` of type ` +
        `\`${getType(value)}\` supplied to \`${parentName}\`, expected an array`
      )
    }
    for (let i = 0; i < value.length; i++) {
      let error = typeChecker.validate(value, i, parentName, `${propFullName}[${i}]`)
      if (error) { 
        return error
      }
    }
    return null
  }

}).statics({

  of(typeChecker) {
    return ArrayOfTypeChecker({typeChecker})
  }

})

const Shape = Stamp.compose(
  Requireable
).init(function ({expectedShape} = {}) {
  if (expectedShape) this[DESCRIPTION] = expectedShape
}).methods({

  check(obj, parentName=null) {
    if (!parentName) parentName = obj.name || typeof obj

    const keys = Object.keys(this[DESCRIPTION])

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let typeChecker = this[DESCRIPTION][key]
      let error = typeChecker.validate(obj, key, parentName, `${parentName}[${key}]`)
      if (error) return error
    }

    return null
  },

  validate(props, key, parentName, propFullName) {
    const err = this.validateExists(props, key, parentName, propFullName)
    if (err) return err

    return this.check(props[key], `${parentName}[${key}]`)
  }

}).statics({

  describe(description) {
    return this.compose({
      properties: {
        [DESCRIPTION]: description
      }
    })
  }

})

export default Shape

export const ArrayType = () => TypeChecker({expectedType: 'array'})
export const StringType = () => TypeChecker({expectedType: 'string'})
export const ObjectType = () => TypeChecker({expectedType: 'object'})
export const FuncType = () => TypeChecker({expectedType: 'function'})
export const BoolType = () => TypeChecker({expectedType: 'boolean'})
export const NumberType = () => TypeChecker({expectedType: 'number'})

export const ArrayOf = typeChecker => ArrayOfTypeChecker({typeChecker})
export const ShapeOf = expectedShape => Shape({expectedShape}) 
