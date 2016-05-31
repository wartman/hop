import { Component, span, input, button } from '../../../../view'

const TodoTextInput = Component.init(function ({
  newTodo,
  onSave,
  text,
  placeholder
} = {}) {
  this.onSave = onSave
  this.state = {placeholder, text, newTodo}
}).node({

  tag: 'input',

  class() {
    return  {
      'new-todo': this.state.newTodo,
      'edit': !this.state.newTodo
    }
  },

  key: 'main-input',

  attrs() {
    const {text, placeholder} = this.state
    return {
      value: text,
      placeholder: placeholder,
      type: 'text'
    }
  },

  events() {
    return {
      blur: this.handleBlur.bind(this),
      keydown: this.handleSubmit.bind(this)
    }
  },

  data() {
    return {
      hook: {
        insert: vnode => vnode.elm.focus()
      }
    }
  }

}).methods({

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
