import Stamp from '../../core/Stamp'

const Wrap = Stamp.methods({

  reduce(state={}, action) {
    return action.type === this.getType() ? action.payload : state
  }

})

export default Wrap
