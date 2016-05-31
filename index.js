import * as core from './core'
import * as view from './view'
import * as data from './data'

const Rabbit = core
Object.assign(Rabbit, { view, data })

export default Rabbit
export {
  view,
  data
}
