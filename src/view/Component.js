import Injectable from '../core/Injectable'
import {uniqueId, isFunction} from '../core/util'
import Patch from './Patch'
import Element from './Element'

/**
 * An internal helper function to create getter methods.
 *
 * @param {String} attr
 * @return {Function}
 */
function makeGetAttrMethod(attr) {
  return function (fn) {
    if (!isFunction(fn)) {
      const value = fn
      fn = () => value
    }
    const name = `get${attr}`
    return this.methods({[name]: fn})
  }
}

/**
 * Components are the basic building blocks of Rabbit views.
 */
const Component = Injectable.inject({
  patch: Patch
}).init(function () {
  this.state = this.state || {}
}).methods({

  /**
   * Return the HTML tag this Component uses.
   *
   * @return {String}
   */
  getTag() {
    return 'div'
  },

  /**
   * A unique identifier used internally by Snabbdom.
   *
   * @return {String|null}
   */
  getKey() {
    return null
  },

  /**
   * Return the classes this component uses. Somewhat un-intuitively, this method
   * should return an OBJECT, not a string, where the value of each property is 
   * truthy or falsy. This lets you toggle classes on or off easily.
   *
   * @return {Object}
   */
  getClass() {
    return null
  },

  /**
   * Get a unique ID for this component.
   *
   * @return {String}
   */
  getId() {
    if (this.$id) {
      return this.$id
    }
    this.$id = uniqueId('rabbit')
    return this.$id
  },

  /**
   * Get additional data for this component. This will be passed to the `data` property
   * when rendered by Snabbdom, so here is where you would add attributes, styles and so
   * forth.
   *
   * @return {Object}
   */
  getData() {
    return {}
  },

  /**
   * Mount this Component on the provided element.
   *
   * @param {HtmlElement} element
   * @return {Void}
   */
  mount(element) {
    this.$element = element
    this.update()
  },

  /**
   * Render the body of the component.
   *
   * Important note: DO NOT PASS THIS METHOD TO `PATCH`. It won't work like you expect.
   * Instead, pass the entire Component to Patch.
   *
   * @return {VNode|null}
   */
  render() {
    return null
  },

  /**
   * Re-render the component
   *
   * @return {Void}
   */
  update() {
    if (!this.$element) {
      this.$element = Element(this.getTag() + '#' + this.getId())
    }
    this.$element = this.patch(this.$element, this).elm
  },

  /**
   * Update the Component's state and re-render it.
   *
   * @param {Object} state
   * @return {this}
   */
  setState(state) {
    this.state = Object.assign({}, this.state, state)
    this.update()
    return this
  }

}).statics({

  tag: makeGetAttrMethod('Tag'),
  id: makeGetAttrMethod('Id'),
  class: makeGetAttrMethod('Class'),
  data: makeGetAttrMethod('Data'),
  body(render) {
    return this.methods({render})
  }

}).compose({

  /**
   * The following descriptors are used to mock a Vnode so that Snabbdom
   * can render the component. They should NOT be overwritten or manually 
   * defined.
   *
   * @see https://github.com/paldepind/snabbdom#virtual-node
   */
  propertyDescriptors: {

    sel: {
      get() {
        let id = this.getId()
        if (id.length) {
          id = '#' + id
        }
        return this.getTag() + id
      }
    },

    data: {
      get() {
        return Object.assign({}, {
          class: this.getClass()
        }, this.getData())
      }
    },

    children: {
      get() {
        let vnodes = this.render()
        if (!Array.isArray(vnodes)) {
          vnodes = [vnodes]
        }
        return vnodes
      }
    },

    key: {
      get() {
        return this.getKey()
      }
    }

  }

})

export default Component
