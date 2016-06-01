import { Store, Component, li, div, input, label, button } from '@wartman/hop'
import TodoTextInput from './TodoTextInput'
import { COMPLETED } from '../updates/Filter'

const TodoItem = Component.inject({
  store: Store
}).init(function ({key, todo, editing} = {}) {
  this.state.key = key
  this.state.todo = todo
  this.state.editing = editing
}).node({
  
  tag: 'li',

  id() {
    return 'todo-' + this.state.todo.id
  },

  class() {
    return {
      todo: true,
      completed: this.state.todo.completed == COMPLETED,
      editing: this.state.editing
    }
  },

  key() {
    return this.state.key
  }

}).methods({

  render() {
    const {todo, editing, key} = this.state
    let body

    if (editing) {
      body = TodoTextInput({
        text: todo.text,
        newTodo: false,
        onSave: (text) => this.handleSave(todo.id, text)
      })
    } else {
      body = div('.view', [
        input('.toggle', {
          props: {
            type: 'checkbox',
            checked: todo.completed == COMPLETED,
          },
          on: {
            change: this.completeTodo.bind(this)
          }
        }),
        label({
          on: {dblclick: this.startEditing.bind(this)}
        }, [
          todo.text
        ]),
        button('.destroy', {on: {click: this.deleteTodo.bind(this)}})
      ])
    }

    return body
  },

  completeTodo() {
    this.store.todos.toggle(this.state.todo)
  },

  deleteTodo() {
    this.store.todos.remove(this.state.todo)
  },

  startEditing() {
    this.setState({editing: true})
  },

  handleSave(id, text) {
    if (text.length === 0) {
      this.deleteTodo()
    } else {
      this.store.todos.update(id, {text})
    }
    this.setState({editing: false})
  }

})

export default TodoItem
