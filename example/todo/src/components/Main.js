import Store from '../../../../src/data/Store'
import Todos from '../actions/Todos'
import Component from '../../../../src/view/Component'
import Reactive from '../../../../src/view/Reactive'
import {section, ul} from '../../../../src/view/elements'
import TodoItem from './TodoItem'
import Header from './Header'

const Main = Component.compose(
  Reactive
).inject({
  todos: Todos
}).methods({

  render() {
    console.log('rendering main')

    const {todos, filter} = this.state
    const filteredTodos = this.filterTodos(todos, filter)

    console.log(filteredTodos)

    return section('.main#root', [
      Header({
        store: this.store,
        todos: this.todos
      }).render(),
      ul('.todo-list', filteredTodos.map(todo =>
        TodoItem({
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
