import { Injectable, Store } from '@wartman/hop'

/**
 * Persist changes from the store using a browser's LocalStorage.
 *
 * Note that this is NOT a real-world-ready implementation, but it works 
 * well enough for demonstration purposes.
 *
 * A similar pattern might be used to persist changes to the store to an API.
 */
const LocalStorage = Injectable.inject({
  store: Store
}).properties({
  id: 'hop_todo_example_cache'
}).methods({

  listen() {
    if (!this.available()) {
      return
    }
    this.unsubscribe = this.store.subscribe(() => {
      this.persist(this.store.getState())
    })
  },

  stopListening() {
    if (this.unsubscribe) this.unsubscribe()
    delete this.unsubscribe
  },

  load() {
    const state = JSON.parse(window.localStorage.getItem(this.id))
    return state || {}
  },

  persist(state) {
    window.localStorage.setItem(this.id, JSON.stringify(state))
    return this
  },

  clear() {
    window.localStorage.removeItem(this.id)
    return this
  },

  available() {
    try {
      var storage = window.localStorage,
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch(e) {
      return false;
    }
  }

})

export default LocalStorage
