import Store from '../../../../src/data/Store'
import Todos from '../actions/Todos'
import Component from '../../../../src/view/Component'
import {li, div, input, label, button} from '../../../../src/view/elements'
import TodoTextInput from './TodoTextInput'

const TodoItem = Component.inject({
  store: Store,
  todos: Todos
}).init(function ({key, todo, editing} = {}) {
  this.state.key = key
  this.state.todo = todo
  this.state.editing = editing
}).methods({

  render() {
    console.log(this.state)
    const {todo, editing, key} = this.state
    let body

    if (editing) {
      body = TodoTextInput({
        text: todo.text,
        newTodo: false,
        onSave: (text) => this.handleSave(todo.id, text)
      }).render()
    } else {
      body = div('.view', [
        input('.toggle', {
          attrs: {
            type: 'checkbox',
            checked: todo.completed,
          },
          on: {
            change: this.completeTodo.bind(this)
          }
        }),
        label({
          on: {doubleClick: this.handleDoubleClick.bind(this)}
        }, [
          todo.text
        ]),
        button('.destroy', {on: {click: this.deleteTodo.bind(this)}})
      ])
    }

    return li({
      key,
      class: {
        completed: todo.completed,
        editing
      }
    }, [
      body
    ])
  },

  completeTodo() {
    this.store.dispatch(this.todos.toggle(this.state.todo))
  },

  deleteTodo() {
    this.store.dispatch(this.todos.remove(this.state.todo))
  },

  updateTodo() {
    this.store.dispatch(this.todos.update(this.state.todo))
  },

  handleDoubleClick() {
    this.setState({editing: true})
  },

  handleSave(id, text) {
    if (text.length === 0) {
      this.deleteTodo()
    } else {
      this.updateTodo()
    }
    this.setState({editing: false})
  }

})

export default TodoItem
