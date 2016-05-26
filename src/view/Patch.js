import snabbdom from 'snabbdom'
import classModule from 'snabbdom/modules/class'
import propsModule from 'snabbdom/modules/props'
import attrsModule from 'snabbdom/modules/attributes'
import styleModule from 'snabbdom/modules/style'
import eventListenersModule from 'snabbdom/modules/eventlisteners'
import Stamp from '../core/Stamp'

/**
 * A factory that returns an instance of the patcher.
 *
 * @return {snabbdom}
 */
const Patch = function () {
  return snabbdom.init([
    classModule,
    propsModule,
    attrsModule,
    styleModule,
    eventListenersModule,
  ])
}

export default Patch
