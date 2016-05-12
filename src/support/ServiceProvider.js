import Injectable from '../core/Injectable'
import Container from '../core/Container'

const ServiceProvider = Injectable.inject({
  app: Container
}).methods({

  register() {
    // ...
  },

  build(next) {
    next()
  }

})

export default ServiceProvider
