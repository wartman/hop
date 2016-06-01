import snabbdom from 'snabbdom'
import classModule from 'snabbdom/modules/class'
import propsModule from 'snabbdom/modules/props'
import attrsModule from 'snabbdom/modules/attributes'
import styleModule from 'snabbdom/modules/style'
import eventListenersModule from 'snabbdom/modules/eventlisteners'

/**
 * A factory that returns an instance of the patcher (via
 * `snabbdom.init()`).
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

/**
 * The default instance of the patcher.
 *
 * @var {Function}
 */
let PATCH_INSTANCE

/**
 * Get the default instance of the patcher. If one does not
 * exist, it'll be created here.
 *
 * While we typically want to avoid singletons in favor of dependency
 * injection in Hop, in this case it makes far more sense to share 
 * `Patch` with all `Components`. 99.99% of the time you won't need to 
 * use anything but the defaults.
 *
 * @return {snabbdom}
 */
Patch.getDefault = function () {
  if (!PATCH_INSTANCE) PATCH_INSTANCE = Patch()
  return PATCH_INSTANCE
}

/**
 * Set the default instance.
 *
 * @param {Function} patch
 * @return {void}
 */
Patch.setDefault = function (patch) {
  PATCH_INSTANCE = patch
}

export default Patch
