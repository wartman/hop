import Reduceable from '../../../src/data/Reduceable'
import Stateful from '../../../src/data/Stateful'
import {deepAssign} from '../../../src/support/util'

const Post = Reduceable.type('post').compose(
  Stateful
).methods({

  handle(data, action) {
    // todo: we could automate all this. Maybe make a Repository class
    //       that handles BREAD updates?
    switch(action.type) {
      case 'post.read': 
        return this.updateItem(data, action.id, action.data)
      case 'post.browse':
        return this.merge(data, action.data)
      default: 
        return data
    }
  },

  updateItem(data, id, post) {
    let position = data.indexOf(post)
    if (position === false) {
      data.push(post)
    } else {
      data[position] = deepAssign({}, data[position], post])
    }
    this.setState(data)
    return data
  },

  merge(data, posts) {
    data = deepAssign([], data, posts)
    this.setState(data)
    return data
  }

})

export default Post
