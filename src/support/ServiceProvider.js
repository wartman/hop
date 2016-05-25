import Injectable from '../core/Injectable'
import Container from '../core/Container'

const ServiceProvider = Injectable.inject({
  app: Container
}).methods({

  register() {
    // ...
  },

  boot(next) {
    next()
  }

})

export default ServiceProvider
