import Store from '../../../../src/data/Store'
import Component from '../../../../src/view/Component'
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
        patch: this.patch,
        onSave: this.handleSave.bind(this),
        newTodo: true,
        placeholder: 'What needs doing?'
      }).render()
    ])
  },

  handleSave(text) {
    console.log('saving')
    console.log(text)
    this.store.dispatch(this.todos.add({text}))
  }

})

export default Header
