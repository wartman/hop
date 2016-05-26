import Injectable from '../core/Injectable'
import {ensureObjectId} from '../core/util'

const Component = Injectable.init(function ({updater}={}) {
  this.updater = updater
  this.state = this.state || {}
}).methods({

  /**
   * Render the component.
   *
   * @return {VNode|null}
   */
  render() {
    return null
  },

  shouldUpdate() {
    return true
  },

  update() {
    if (this.updater && this.updater.patch) {
      this.element = this.updater.patch(this.element, this.render())
    }
  },

  /**
   * Update the Component's state and re-render it (IF there is an updater assigned).
   *
   * @param {Object} state
   * @return {this}
   */
  setState(state) {
    this.state = Object.assign({}, this.state, state)
    this.update()
    return this
  }

})

export default Component
