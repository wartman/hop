import Store from '../../../../src/data/Store'
import Component from '../../../../src/view/Component'
import {section, ul} from '../../../../src/view/elements'
import TodoItem from './TodoItem'
import Header from './Header'

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
      ))
    ]
  },

  filterTodos(todos, filter) {
    if (filter === null) return todos
    return todos.filter(todo => todo.completed === filter)
  }

})

export default Main
