import Component from '../../../../src/view/Component'
import Config from '../../../../src/support/Config'
import Store from '../../../../src/data/Store'
import {header, h1} from '../../../../src/view/elements'
import TodoTextInput from './TodoTextInput'
import Todos from '../actions/Todos'

const Header = Component.tag('header').id('header').class({
  header: true
}).inject({
  store: Store,
  todos: Todos,
  config: Config
}).methods({

  render() {
    return [
      h1('todos'),
      TodoTextInput({
        patch: this.patch,
        onSave: this.handleSave.bind(this),
        newTodo: true,
        text: '',
        placeholder: this.config.get('placeholder', 'What needs doing?')
      })
    ]
  },

  handleSave(text) {
    if (text.length) {
      this.store.dispatch(this.todos.add({text}))
    }
  }

})

export default Header
