import Rabbit from '../src/Rabbit'
import ServiceProvider from '../src/support/ServiceProvider'
import Config from '../src/support/Config'

const LoggerService = ServiceProvider.methods({

  register() {
    this.app.bind('logger', c => console.log.bind(console))
  }

})

const HelloWorldService = ServiceProvider.methods({

  register() {
    this.app.bind('hello', c => `hello ${c.make(Config).get('location')}`)
  },

  boot(next) {
    const logger = this.app.make('logger')
    const greeting = this.app.make('hello')
    logger(greeting)
    next()
  } 

})

Rabbit({
  location: 'world'
}).services(
  HelloWorldService,
  LoggerService
).run()
