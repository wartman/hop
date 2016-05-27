import Update, {Action} from '../../../../src/data/Update'

const Todos = Update.type('todos').init(function () {
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

  remove: Action('todo', (state, todo) => state.filter(item => item.id !== todo.id))

}).methods({

  updateTodo(todo) {
    const id = todo.id || this.uniqueId()
    return {
      id: id,
      text: todo.text,
      completed: false
    }
  },

  toggleTodo(state, action) {
    if (action.id !== state.id) {
      return state
    }
    return Object.assign({}, state, {
      completed: !state.completed
    })
  },

  uniqueId() {
    return this._id++
  }

})

export default Todos
