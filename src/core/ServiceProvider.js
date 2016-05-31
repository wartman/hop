import Injectable from './Injectable'
import Container from './Container'

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
