import Reduceable from './Reduceable'

const TYPE = Symbol('type')

const Action = Reduceable.methods({

  send(payload) {
    return {
      type: this.getType(),
      payload: this.format(payload)
    }
  },

  receive(state, action) {
    return this.reduce(state, action)
  },

  getType() {
    return this[TYPE]
  },

  format(payload) {
    return payload
  }

}).statics({

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
  }

})

export default Action
