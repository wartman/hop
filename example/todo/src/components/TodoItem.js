import Store from '../../../../src/data/Store'
import Component from '../../../../src/view/Component'
import {li, div, input, label, button} from '../../../../src/view/elements'
import TodoTextInput from './TodoTextInput'

const TodoItem = Component.tag('li').inject({
  store: Store
}).init(function ({key, todo, editing} = {}) {
  this.state.key = key
  this.state.todo = todo
  this.state.editing = editing
}).methods({

  getClass() {
    return {
      todo: true,
      completed: this.state.todo.completed,
      editing: this.state.editing
    }
  },

  getId() {
    return 'todo-' + this.state.todo.id 
  },

  getKey() {
    return this.state.key
  },

  render() {
    const {todo, editing, key} = this.state
    let body

    if (editing) {
      body = TodoTextInput({
        patch: this.patch,
        text: todo.text,
        newTodo: false,
        onSave: (text) => this.handleSave(todo.id, text)
      })
    } else {
      body = div('.view', [
        input('.toggle', {
          props: {
            type: 'checkbox',
            checked: todo.completed,
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

  updateTodo() {
    this.store.todos.update(this.state.todo)
  },

  startEditing() {
    this.setState({editing: true})
  },

  handleSave(id, text) {
    if (text.length === 0) {
      this.deleteTodo()
    } else {
      this.state.todo.text = text
      this.updateTodo()
    }
    // this.setState({editing: false})
  }

})

export default TodoItem
