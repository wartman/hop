import { Config } from '../../../../core'
import { Store } from '../../../../data'
import { Component, header, h1, button } from '../../../../view'
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

      button({
        class: { 'sync-button': true },
        on: {click: this.getFromServer.bind(this)}
      }, 'Sync'),

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
  },

  getFromServer(e) {
    e.preventDefault()
    this.store.request.fetchAll()
  },

})

export default Header
