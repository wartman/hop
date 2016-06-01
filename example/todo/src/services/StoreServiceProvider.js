import { ServiceProvider, Store } from '@wartman/hop'
import Todos from '../updates/Todos'
import Filter from '../updates/Filter'
import { ALL } from '../updates/Filter'
import LocalStorage from '../data/LocalStorage'

const StoreServiceProvider = ServiceProvider.methods({

  register() {
    this.app.share(LocalStorage)
    this.app.share(Store, c => Store.updates(
      Todos,
      Filter
    ).new({
      app: c,
      initialState: {
        todos: [],
        filter: {
          label: 'All',
          value: ALL
        }
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
