import Component from '../../../../src/view/Component'
import {span, input, button} from '../../../../src/view/elements'

const TodoTextInput = Component.tag('input').init(function ({
  newTodo,
  onSave,
  text,
  placeholder
} = {}) {
  this.onSave = onSave
  this.state = {placeholder, text, newTodo}
}).methods({

  getClass() {
    return  {
      'new-todo': this.state.newTodo,
      'edit': !this.state.newTodo
    }
  },

  getKey() {
    return 'main-input'
  },

  getData() {
    const {text, placeholder} = this.state
    return {
      on: {
        blur: this.handleBlur.bind(this),
        keydown: this.handleSubmit.bind(this)
      },
      attrs: {
        value: text,
        placeholder: placeholder,
        type: 'text'
      },
      hook: {
        insert: vnode => vnode.elm.focus()
      }
    }
  },

  handleSubmit(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      this.onSave(e.target.value)
      if (this.state.newTodo) {
        this.setState({text: ''})
      }
    }
  },

  handleBlur(e) {
    if (!this.state.newTodo) {
      this.onSave(e.target.value)
    }
  }

})

export default TodoTextInput
