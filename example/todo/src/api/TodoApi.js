import Injectable from '../../../../src/core/Injectable'
import Store from '../../../../src/data/Store'

/**
 * Here's an example of how we might handle a request to an API.
 * This Stamp doesn't need to interact with anything except for the
 * store, meaning it's completely decoupled from the rest of the app.
 * Which is neat.
 *
 * This may get rolled into Rabbit in some way, but for now...
 */
const TodoApi = Injectable.inject({
  store: Store
}).methods({

  listen() {
    // Let's listen in for any changes in our Store.
    this.unsubscribe = this.store.subscribe(() => 
      this.handleRequest(this.store.request.getState())
    )
  },

  stopListening() {
    if (this.unsubscribe) this.unsubscribe()
    delete this.unsubscribe
  },

  /**
   * This will receive the current state of our Request Update in our
   * store. If it's pending, we'll send a request to our API (or, in this
   * case, mock it up with a setTimeout)
   */
  handleRequest(request) {
    if (request.status == 'pending') {
      // mock up an API request
      setTimeout(() => {
        // Tell our request that its been handled.
        this.store.request.received()

        // Sync up our Todos with our `server`
        this.store.todos.sync([
          {id: 1, text: 'Do a Thing', completed: false},
          {id: 2, text: 'And another', completed: false},
          {id: 3, text: 'Ok?', completed: false}
        ])
      }, 1000)
    }
  }

})

export default TodoApi
