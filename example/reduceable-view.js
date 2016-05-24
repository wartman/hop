import Rabbit from '../Rabbit'
import ViewServiceProvider from '../src/view/ViewServiceProvider'
import ServiceProvider from '../src/support/ServiceProvider'
import Run from '../src/events/Run'
import Component from '../src/view/Component'
import Store from '../src/data/Store'
import Reduceable from '../src/data/Reduceable'
import {div, p} from '../src/view/elements'

const Location = Reduceable.type('location')

const HelloWorld = Component.inject({
  store: Store
}).init(function () {
  // todo: should be automated
  this.store.subscribe(() => this.$renderAndPatchElement())
}).methods({

  render() {
    const {location} = this.store.getState()
    return div('.hello', [
      p(`Hello ${location}!`)
    ])
  }

})

const HelloWorldService = ServiceProvider.methods({

  register() {
    this.app.bind(HelloWorld)
    this.app.share(Location)
    this.app.share(Store, c => {
      return Store.reduces({
        location: c.make(Location)
      }).new()
    })
  }

  boot(next) {
    this.app.listen(Run, event => {
      const store = this.app.make(Store)
      const hello = this.app.make(HelloWorld, {el: div('.foo')})
      store.dispatch({type: 'location', data: 'world'})
    })
    next()
  }

})

Rabbit({}).services(
  HelloWorldService,
  ViewServiceProvider
).run()
