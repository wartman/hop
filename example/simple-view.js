import Rabbit from '../Rabbit'
import ViewServiceProvider from '../src/view/ViewServiceProvider'
import ServiceProvider from '../src/support/ServiceProvider'
import Run from '../src/events/Run'
import Component from '../src/view/Component'
import {div, p} from '../src/view/elements'

const HelloWorld = Component.methods({

  render() {
    return div('.hello', [
      p('Hello world!')
    ])
  }

})

const HelloWorldService = ServiceProvider.methods({

  register() {
    this.app.bind(HelloWorld)
  }

  boot(next) {
    this.app.listen(Run, event => {
      const hello = this.app.make(HelloWorld, {el: div('.foo')})
      console.log(hello.render())
    })
    next()
  }

})

Rabbit({}).services(
  HelloWorldService,
  ViewServiceProvider
).run()
