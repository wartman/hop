import { ServiceProvider, Store } from '@wartman/hop'
import Todos from '../updates/Todos'
import Filter from '../updates/Filter'
import { ALL, COMPLETED, ACTIVE } from '../updates/Filter'
import LocalStorage from '../data/LocalStorage'

const StoreServiceProvider = ServiceProvider.methods({

  register() {

    // Very dumb routing:
    const hash = window.location.hash
    const filter = hash === '#completed' 
      ? {
        label: 'Completed',
        value: COMPLETED
      } 
      : hash === '#active' 
        ? {
          label: 'Active',
          value: ACTIVE 
        } : {
          label: 'All',
          value: ALL
        }

    this.app.share(LocalStorage)
    this.app.share(Store, c => Store.updates(
      Todos,
      Filter
    ).new({
      app: c,
      initialState: {
        todos: [],
        filter
      }
    }))
  },

  boot(next) {
    const store = this.app.make(Store)
    const localStore = this.app.make(LocalStorage)

    if (localStore.available()) {

      // Bind to the Store.
      localStore.listen()

      // Update from previous state
      const cache = localStore.load()
      if (cache.todos) {
        store.todos.sync(cache.todos)
      }

    } else {
      console.warn('No local storage available. Changes will not persist.')
    }

    next()
  }

})

export default StoreServiceProvider
