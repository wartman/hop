import Action from '../../../src/data/Action'
import Resource from '../../../src/data/reducers/Resource'
import {deepAssign} from '../../../src/support/util'

const User = Action.type('user').compose(Resource)

export default User
