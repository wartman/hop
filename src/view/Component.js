import Injectable from '../core/Injectable'
import {uniqueId, isFunction, isObject} from '../core/util'
import Patch from './Patch'

function getValue(value, context, def = null ) {
  if (!value) return isFunction(def) ? def() : def
  return isFunction(value) ? value.call(context) : value
}

/**
 * Components are the basic building blocks of Rabbit views.
 */
const Component = Injectable.init(function ({patch} = {}) {
  if (patch) { 
    this.patch = patch
  } else {
    this.patch = Patch.getDefault()
  }
  this.state = this.state || {}
}).methods({

  /**
   * Return the HTML tag this Component uses.
   *
   * @return {String}
   */
  getSel() {
    const tag = getValue(this.node.tag, this, 'div')
    const id = this.getId()
    if (id) return tag + '#' + id
    return tag
  },

  /**
   * Get the ID for the Component. If none is provided, a unique one will be
   * generated
   *
   * @return {String}
   */
  getId() {
    return getValue(this.node.id, this)
  },

  /**
   * Return the classes this component uses. Somewhat un-intuitively, this method
   * should return an OBJECT, not a string, where the value of each property is 
   * truthy or falsy. This lets you toggle classes on or off easily.
   *
   * @return {Object}
   */
  getClass() {
    const classes = getValue(this.node.class, this)
    if (classes && !isObject(classes)) {
      const obj = {}
      if (Array.isArray(classes)) {
        classes.forEach(cls => obj[cls] = true)
        return obj
      }
      obj[classes] = true
      return obj
    }
    return classes
  },

  /**
   * Get additional data for this component. This will be passed to the `data` property
   * when rendered by Snabbdom, so here is where you would add attributes, styles and so
   * forth.
   *
   * @return {Object}
   */
  getData() {
    return getValue(this.node.data, this, {})
  },

  /**
   * Get attributes for this Component.
   *
   * @return {Object}
   */
  getAttrs() {
    return getValue(this.node.attrs, this)
  },

  /**
   * Get the key for this Component
   *
   * @return {mixed}
   */
  getKey() {
    return getValue(this.node.key, this)
  },

  /**
   * Render the body of the component.
   *
   * Important note: DO NOT PASS THIS METHOD TO `PATCH`. It won't work like you expect.
   * Instead, pass the entire Component to Patch.
   *
   * @return {VNode|Array}
   */
  render() {
    return getValue(this.node.children, this, [])
  },

  /**
   * Mount this Component on the provided element.
   *
   * @param {HtmlElement} element
   * @return {Void}
   */
  mount(element) {
    this.patch(element, this)
  },

  /**
   * Re-render the component.
   *
   * Note: `this.elm` is added to all VNodes by snabbdom. It points to the REAL DOM
   * node the VNode is bound to. We get it for free because Snabbdom is treating our
   * component like any other vnode.
   *
   * @return {Void}
   */
  update() {
    if (!this.elm) {
      throw new Error(
        'A Component must be mounted or added as part of a parent element' +
        'before it can be updated.'
      )
    }
    this.patch(this.elm, this)
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

  /**
   * Define the VNode for this component.
   *
   * @param {Object} node
   */
  node(node) {
    return this.compose({
      properties: {node}
    })
  }
  
}).compose({

  properties: {

    /**
     * Default Node descriptors.
     */
    node: {
      tag: 'div'
    }

  },

  /**
   * The following descriptors are used to mock a Vnode so that Snabbdom
   * can render the component. They should NOT be overwritten or manually 
   * defined. Use Component.node(...) instead.
   *
   * @see https://github.com/paldepind/snabbdom#virtual-node
   */
  propertyDescriptors: {

    sel: {
      get() {
        return this.getSel()
      }
    },

    data: {
      get() {
        const data = Object.assign({}, {
          class: this.getClass(),
          attrs: this.getAttrs()
        }, this.getData())
        return data
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
