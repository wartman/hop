import Store from '../../../src/data/Store'
import ServiceProvider from '../../../src/support/ServiceProvider'
import Todos from './updates/Todos'
import Filter from './updates/Filter'

const StoreServiceProvider = ServiceProvider.methods({

  register() {
    this.app.share(Store, c => Store.updates(
      Todos(),
      Filter()
    ).new({
      initialState: {
        todos: [],
        filter: {
          label: 'All',
          value: null
        }
      }
    }))
  }

})

export default StoreServiceProvider
