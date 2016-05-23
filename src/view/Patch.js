import snabbdom from 'snabbdom'
import classModule from 'snabbdom/modules/class'
import propsModule from 'snabbdom/modules/props'
import styleModule from 'snabbdom/modules/style'
import eventListenersModule from 'snabbdom/modules/eventlisteners'
import Stamp from '../core/Stamp'

/**
 * Escape HTML in a string.
 *
 * @param {string} txt
 * @returns {string}
 */
function escapeHtml(txt) {
  return txt
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * This is a small plugin that escapes a vnode's `text` attribute unless
 * `vnode.data.safe` === true. This is a much better, and safer, default behavior.
 *
 * @param {VNode} vnode
 * @returns {void}
 */
function makeSafe(vnode) {
  if (vnode.data.safe === true) return
  if (!vnode.text || 'string' != typeof vnode.text) return
  vnode.text = escapeHtml(vnode.text)
}

/**
 * A factory that returns an instance of the patcher.
 *
 * @return {snabbdom}
 */
const Patch = function ({api} = {}) {
  return snabbdom.init([
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    makeSafe
  ], api)
}

export default Patch
