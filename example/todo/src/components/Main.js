import Store from '../../../../src/data/Store'
import Todos from '../actions/Todos'
import Component from '../../../../src/view/Component'
import TodoItem from './TodoItem'
import Header from './Header'
import {section, ul} from '../../../../src/view/elements'

const Main = Component.inject({
  store: Store,
  todos: Todos
}).init(function () {
  this.state = this.store.getState()
  this.store.subscribe(() => {
    console.log('changing', this.store.getState())
    this.setState(this.store.getState())
  })
}).methods({

  render() {
    console.log('rendering main')
    console.log(this.el)

    const {todos, filter} = this.state
    const filteredTodos = this.filterTodos(todos, filter)

    console.log(filteredTodos)

    return section('.main#root', [
      Header({
        patch: this.patch,
        store: this.store,
        todos: this.todos
      }).render(),
      ul('.todo-list', filteredTodos.map(todo =>
        TodoItem({
          patch: this.patch,
          store: this.store,
          todos: this.todos,
          editing: false,
          todo, 
          key: todo.id
        }).render()
      ))
    ])
  },

  filterTodos(todos, filter) {
    if (filter === null) return todos
    return todos.filter(todo => todo.completed === filter)
  }

})

export default Main
