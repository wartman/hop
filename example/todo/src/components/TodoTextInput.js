import Component from '../../../../src/view/Component'
import {span, input, button} from '../../../../src/view/elements'

const TodoTextInput = Component.tag('span').init(function ({
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
    return [
      input({
        key: 'main-input',
        class: {
          'new-todo': this.state.newTodo,
          'edit': !this.state.newTodo
        },
        on: {
          blur: this.handleBlur.bind(this),
          change: this.updateText.bind(this),
          keydown: this.handleSubmit.bind(this)
        },
        props: {
          value: text,
          placeholder: placeholder,
          type: 'text',
          autofocus: true
        }
      }),
      // button({
      //   on: { click: this.handleSubmit.bind(this) }
      // }, ['Save'])
    ]
  },

  updateText(e) {
    this.setState({text: e.target.value})
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
    this.updateText(e)
    if (!this.state.newTodo) {
      this.onSave(e.target.value)
    }
  }

})

export default TodoTextInput
