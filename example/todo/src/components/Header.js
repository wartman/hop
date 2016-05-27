import Component from '../../../../src/view/Component'
import Config from '../../../../src/support/Config'
import Store from '../../../../src/data/Store'
import {header, h1} from '../../../../src/view/elements'
import TodoTextInput from './TodoTextInput'

const Header = Component.inject({
  store: Store,
  config: Config
}).node({
  tag: 'header',
  id: 'header',
  class: 'header'
}).methods({

  render() {
    return [
      h1('todos'),
      TodoTextInput({
        onSave: this.handleSave.bind(this),
        newTodo: true,
        text: '',
        placeholder: this.config.get('placeholder', 'What needs doing?')
      })
    ]
  },

  handleSave(text) {
    if (text.length) {
      this.store.todos.add({text})
    }
  }

})

export default Header
