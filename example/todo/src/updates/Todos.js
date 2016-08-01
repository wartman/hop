import { Update, Action, Shape } from '@wartman/hop'
import { ACTIVE, COMPLETED } from './Filter'

const Todos = Update.type('todos').shape(Shape.array.of({
  id: Shape.number.isRequired,
  text: Shape.string.isRequired,
  completed: Shape.number.isRequired
})).init(function () {
  this._id = 0
}).actions({

  add: Action('todo', function (state, todo) {
    return [
      ...state,
      this.updateTodo(todo)
    ]
  }),

  update: Action('id', 'todo', function(state, id, todo) {
    return state.map(item => {
      if (item.id === id) {
        return this.updateTodo(Object.assign({}, item, todo))
      }
      return item
    })
  }),

  toggle: Action('todo', function (state, todo) {
    return state.map(item => this.toggleTodo(item, todo))
  }),

  sync: Action('todos', function (state, todos) {
    const updated = state.map(original => {
      const update = todos.find(todo => todo.id == original.id)
      if (update) {
        todos.splice(todos.indexOf(update), 1)
        return update
      }
      return original
    }).concat(todos).sort((a, b) => {
      if (a.id < b.id) {
        return -1
      }
      if (a.id > b.id) {
        return 1
      }
      return 0
    })
    // make sure our Ids don't repeat.
    this._id = updated[updated.length - 1].id + 1
    return updated
  }),

  remove: Action('todo', (state, todo) => state.filter(item => item.id !== todo.id)),

  removeCompleted: Action((state) => state.filter(item => item.completed == ACTIVE))

}).methods({

  updateTodo(todo) {
    const id = todo.id || this.uniqueId()
    return {
      id: id,
      text: todo.text,
      completed: ACTIVE
    }
  },

  toggleTodo(state, action) {
    if (action.id !== state.id) {
      return state
    }
    return Object.assign({}, state, {
      completed: state.completed == ACTIVE ? COMPLETED : ACTIVE
    })
  },

  uniqueId() {
    return this._id++
  }

})

export default Todos
