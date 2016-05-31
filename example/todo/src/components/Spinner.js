import { Store } from '../../../../data'
import { Component, span } from '../../../../view'

/**
 * Here's an example of how a spinner might work.
 *
 * We're listening only to the Request update on our store. This doesn't 
 * require us to know anything about how the request is being handled -- we
 * only care if it's pending or not.
 */
const Spinner = Component.inject({
  store: Store
}).init(function () {
  this.state = this.store.request.getState()
  this.store.subscribe(() => this.setState(this.store.request.getState()))
}).node({
  tag: 'div',
  class() {
    return {
      spinner: true,
      hidden: this.state.status != 'pending'
    }
  },
  children: span('Loading...'),
  id: 'spinner'
})

export default Spinner
