import { Store } from '../../../../data'
import { Component, section, ul } from '../../../../view'
import TodoItem from './TodoItem'
import Footer from './Footer'
import { ALL, ACTIVE, COMPLETED } from '../updates/Filter'

const Main = Component.inject({
  store: Store
}).init(function () {
  this.state = this.store.getState()
  this.store.subscribe(() => this.setState(this.store.getState()))
}).node({
  tag: 'section',
  id: 'main'
}).methods({

  render() {
    const {todos, filter} = this.state
    const filteredTodos = this.filterTodos(todos, filter.value)

    return [
      ul('.todo-list', filteredTodos.map(todo =>
        TodoItem({
          store: this.store,
          editing: false,
          todo, 
          key: todo.id
        })
      )),
      Footer({
        store: this.store,
        state: this.state
      })
    ]
  },

  filterTodos(todos, filter) {
    if (filter === ALL) return todos
    return todos.filter(todo => todo.completed === filter)
  }

})

export default Main
