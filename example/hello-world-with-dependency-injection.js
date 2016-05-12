import Rabbit from '../src/Rabbit'

const LoggerService = Rabbit.ServiceProvider.methods({

  register() {
    this.app.bind('logger', c => console.log.bind(console))
  }

})

const HelloWorldService = Rabbit.ServiceProvider.methods({

  register() {
    this.app.bind('hello', c => `hello ${c.make(Rabbit.Config).get('location')}`)
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
