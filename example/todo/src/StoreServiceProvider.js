import Store from '../../../src/data/Store'
import ServiceProvider from '../../../src/support/ServiceProvider'
import Todos from './actions/Todos'
import Filter from './actions/Filter'

const StoreServiceProvider = ServiceProvider.methods({

  register() {
    this.app.share(Todos)
    this.app.share(Filter)
    this.app.share(Store, c => Store.actions(
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
