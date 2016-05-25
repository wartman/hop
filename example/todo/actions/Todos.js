import Action, {Binding} from '../../../src/data/Action'

const Todos = Action.type('todos').actions({

  add: Binding('todo', function (state, todo) {
    return [
      ...state,
      this.makeTodo(todo)
    ]
  }),

  toggle: Binding('todo', function (state, todo) {
    return state.map(item => this.toggleTodo(item, todo))
  }),

  remove: Binding('todo', (state, todo) => state.filter(item => item.id !== todo.id))

}).methods({

  makeTodo(todo) {
    return {
      id: todo.id,
      text: todo.text,
      completed: false
    }
  },

  toggleTodo(state, action) {
    if (action.id !== todo.id) {
      return state
    }
    return Object.assign({}, state, {
      completed: !state.completed
    })
  }

})

export default Todos
