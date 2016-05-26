import Component from '../../../../src/view/Component'
import {span, input, button} from '../../../../src/view/elements'

const TodoTextInput = Component.init(function ({
  newTodo,
  onSave,
  text,
  placeholder
} = {}) {
  this.onSave = onSave
  this.state = {placeholder, text, newTodo}
}).methods({

  render() {
    const {text, placeholder} = this.state
    return span([
      input('.add', {
        key: 'main-input',
        on: {
          blur: this.handleBlur.bind(this),
          change: this.updateText.bind(this)
        },
        props: {
          value: text,
          placeholder: placeholder,
          type: 'text',
          autoFocus: true
        }
      }),
      button({
        on: { click: this.handleSubmit.bind(this) }
      }, ['Save'])
    ])
  },

  updateText(e) {
    this.setState({text: e.target.value})
  },

  handleSubmit(e) {
    this.onSave(this.state.text)
    if (this.state.newTodo) {
      this.setState({text: ''})
    }
  },

  handleBlur(e) {
    this.updateText(e)
    if (!this.state.newTodo) {
      this.onSave(e.target.value)
    }
  }

})

export default TodoTextInput
