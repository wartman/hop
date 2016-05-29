import Store from '../../../../src/data/Store'
import ServiceProvider from '../../../../src/support/ServiceProvider'
import Todos from '../updates/Todos'
import Filter from '../updates/Filter'
import Request from '../updates/Request'
import { ALL } from '../updates/Filter'

const StoreServiceProvider = ServiceProvider.methods({

  register() {
    this.app.share(Store, c => Store.updates(
      Todos,
      Filter,
      Request
    ).new({
      app: c,
      initialState: {
        todos: [],
        filter: {
          label: 'All',
          value: ALL
        },
        request: {
          status: 'complete'
        }
      }
    }))
  }

})

export default StoreServiceProvider
