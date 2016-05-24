import Reduceable from './Reduceable'

// todo: this is following an inheritance pattern. A better, more Stampy way of 
//       doing this? We want composition, not inheritance.
const Repository = Reduceable.methods({

  // todo: add `getState`, etc. Repositories act as proxies for the Store.

  handle(data={}, action) {
    const type = this.getType()
    // todo: handle all BREAD actions?
    switch(action.type) {
      case `${type}.read`:
        return this.updateItem(data, action.id, action.data)
      case `${type}.browse`:
        return this.update(data, action.data)
      // and so forth
      default: 
        return data
    }
  }

})

export default Repository
