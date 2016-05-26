import Component from '../../../../src/view/Component'
import Store from '../../../../src/data/Store'
import {header, h1} from '../../../../src/view/elements'
import TodoTextInput from './TodoTextInput'
import Todos from '../actions/Todos'

const Header = Component.inject({
  store: Store,
  todos: Todos
}).methods({

  render() {
    return header('.header', [
      h1('Todos'),
      TodoTextInput({
        onSave: this.handleSave.bind(this),
        newTodo: true,
        text: '',
        placeholder: 'What needs doing?'
      }).render()
    ])
  },

  handleSave(text) {
    if (text.length) {
      this.store.dispatch(this.todos.add({text}))
    }
  }

})

export default Header
