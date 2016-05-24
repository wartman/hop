import Store from '../../../src/data/Store'
import ServiceProvider from '../../../src/support/ServiceProvider'
import Post from './Post'

const ModelServiceProvider = ServiceProvider.methods({

  register() {
    this.app.share(Post)
    this.app.share(Store, c => {
      return Store.reduces({
        post: c.make(Post)
      }).new({
        // todo: bootstrap vars go here
      })
    })
  }

})

export default ModelServiceProvider
