import Store from '../../../src/data/Store'
import ServiceProvider from '../../../src/support/ServiceProvider'
import Post from './Post'
import User from './User'

const ModelServiceProvider = ServiceProvider.methods({

  register() {
    this.app.share(Store, c => {
      return Store.actions(
        Post(),
        User()
      ).new({
        // todo: bootstrap vars go here
      })
    })
  }

})

export default ModelServiceProvider
