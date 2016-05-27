import snabbdom from 'snabbdom'
import classModule from 'snabbdom/modules/class'
import propsModule from 'snabbdom/modules/props'
import attrsModule from 'snabbdom/modules/attributes'
import styleModule from 'snabbdom/modules/style'
import eventListenersModule from 'snabbdom/modules/eventlisteners'

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

let PATCH_INSTANCE

Patch.getDefault = function () {
  if (!PATCH_INSTANCE) PATCH_INSTANCE = Patch()
  return PATCH_INSTANCE
}

Patch.setDefault = function (patch) {
  PATCH_INSTANCE = patch
}

export default Patch
