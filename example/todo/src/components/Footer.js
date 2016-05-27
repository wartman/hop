import Component from '../../../../src/view/Component'
import Store from '../../../../src/data/Store'
import {ul, li, a, span, strong, button} from '../../../../src/view/elements'

const Footer = Component.inject({
  store: Store
}).init(function () {
  this.state = this.store.getState()
  this.store.subscribe(() => this.setState(this.store.getState()))
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
    const filteredTodos = this.filterTodos(todos, false)
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
            class: {selected: filter.label === 'All'},
            on: {click: this.showAll.bind(this)}
          }, 'All')
        ]),
        li([
          a({
            attrs: {href: "#active"},
            class: {selected: filter.label === 'Active'},
            on: {click: this.showActive.bind(this)}
          }, 'Active')
        ]),
        li([
          a({
            attrs: {href: "#completed"},
            class: {selected: filter.label === 'Completed'},
            on: {click: this.showCompleted.bind(this)}
          }, 'Completed')
        ])
      ]),

      button({
        class: { 
          'clear-completed': true,
          hidden: (
            this.filterTodos(todos, true).length === 0
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
    if (filter === null) return todos
    return todos.filter(todo => todo.completed === filter)
  }

})

export default Footer
