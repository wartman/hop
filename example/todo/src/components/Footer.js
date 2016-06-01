import { Store, Component, ul, li, a, span, strong, button } from '@wartman/hop'
import { ALL, ACTIVE, COMPLETED } from '../updates/Filter'

const Footer = Component.inject({
  store: Store
}).node({
  tag: 'footer',
  id: 'footer',
  class() {
    return {
      footer: true,
      hidden: this.state.todos.length === 0
    }
  }
}).methods({

  render() {
    const {todos, filter} = this.state
    const filteredTodos = this.filterTodos(todos, ACTIVE)
    const count = filteredTodos.length

    return [

      span('.todo-count', [
        strong(count),
        count === 1 ? ' item left' : ' items left'
      ]),

      ul('.filters', [
        li([
          a({
            attrs: {href: "#all"},
            class: {selected: filter.value === ALL},
            on: {click: this.showAll.bind(this)}
          }, 'All')
        ]),
        li([
          a({
            attrs: {href: "#active"},
            class: {selected: filter.value === ACTIVE},
            on: {click: this.showActive.bind(this)}
          }, 'Active')
        ]),
        li([
          a({
            attrs: {href: "#completed"},
            class: {selected: filter.value === COMPLETED},
            on: {click: this.showCompleted.bind(this)}
          }, 'Completed')
        ])
      ]),

      button({
        class: { 
          'clear-completed': true,
          hidden: (
            this.filterTodos(todos, COMPLETED).length === 0
            || filter.label == 'Active'
          )
        },
        on: {click: this.removeCompleted.bind(this)}
      }, 'Clear Completed')

    ]
  },

  showActive(e) {
    this.store.filter.active()
  },

  showCompleted(e) {
    this.store.filter.completed()
  },

  showAll(e) {
    this.store.filter.all()
  },

  removeCompleted(e) {
    this.store.todos.removeCompleted()
  },

  filterTodos(todos, filter) {
    if (filter === 0) return todos
    return todos.filter(todo => todo.completed === filter)
  }

})

export default Footer
