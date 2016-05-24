import Action from '../../../src/data/Action'
import Resource from '../../../src/data/reducers/Resource'
import {deepAssign} from '../../../src/support/util'

const Post = Action.type('post').compose(Resource)

export default Post
