import Injectable from '../core/Injectable'
import EventEmitter from '../support/EventEmitter'
import Patch from './Patch'

const Component = Injectable.compose(
  EventEmitter
).inject({
  patch: Patch
}).init(function (options={}) {
  this.$ensureEl(options.el)
}).methods({

  /**
   * Render the component.
   *
   * @return {VNode|null}
   */
  render() {
    return null
  },

  /**
   * Check if the component should update. By default this simply returns true,
   * but you can use this to skip unneeded updates.
   *
   * @return {Boolean}
   */
  shouldComponentUpdate() {
    return true
  },

  /**
   * Patch the given vnodes into the current el. This should be called inside your
   * render method.
   *
   * @param {VNode} vnodes
   * @returns {this}
   */
  $patch(vnodes) {
    this.el = this.patch(this.el, vnodes)
    return this
  },

  /**
   * Ensure an element is bound to this view.
   *
   * @param {mixed} el
   * @returns {void}
   */
  $ensureEl(el) {
    if (!el) {
      if (document) {
        this.el = document.createElement('div')
      } else {
        this.el = {}
      }
      return
    }
    // todo: if el is a string, treat it as a query and find the matching element
    this.el = el
  },

  /**
   * Run the render method and use it to patch the parent element.
   *
   * @returns {void}
   */
  $renderAndPatchElement() {
    const vnodes = this.render()
    this.$patch(vnodes)
  }

})

export default Component
