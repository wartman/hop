import Component from '../../../../src/view/Component'
import {input} from '../../../../src/view/elements'

const TodoTextInput = Component.init(function ({newTodo, onSave, placeholder} = {}) {
  this.onSave = onSave
  this.state.placeholder = placeholder
  this.state.text = ''
  this.state.newTodo = newTodo
}).methods({

  render() {
    const {text, placeholder} = this.state
    return input('.add', {
      on: {
        blur: this.handleBlur.bind(this),
        change: this.handleSubmit.bind(this)
      },
      props: {
        value: text,
        placeholder: placeholder,
        type: 'text',
        autoFocus: true
      }
    })
  },

  handleSubmit(e) {
    const text = e.target.value.trim()
    this.onSave(text)
    if (this.state.newTodo) {
      this.setState({text: ''})
    }
  },

  handleBlur(e) {
    if (!this.state.newTodo) {
      this.onSave(e.target.value)
    }
  }

})

export default TodoTextInput
