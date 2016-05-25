import Rabbit from '../Rabbit'
import ViewServiceProvider from '../src/view/ViewServiceProvider'
import ServiceProvider from '../src/support/ServiceProvider'
import Run from '../src/events/Run'
import Component from '../src/view/Component'
import Store from '../src/data/Store'
import Action, {Binding} from '../src/data/Action'
import Boolean from '../src/data/reducers/Boolean'
import {div, p} from '../src/view/elements'

const Location = Action.type('location').actions({

  change: Binding(
    'location', 
    (state, location) => Object.assign({}, state, {name: location})
  )

})

const HelloWorld = Component.inject({
  store: Store
}).init(function () {
  // todo: should be automated
  this.store.subscribe(() => this.$renderAndPatchElement())
}).methods({

  render() {
    const {location} = this.store.getState()
    return div('.hello', [
      p(`Hello ${location.name}!`)
    ])
  }

})

const HelloWorldService = ServiceProvider.methods({

  register() {
    this.app.bind(HelloWorld)
    this.app.share(Location)
    this.app.share(Store, c => {
      return Store.actions(Location()).new()
    })
  }

  boot(next) {
    this.app.listen(Run, event => {
      const store = this.app.make(Store)
      const location = this.app.make(Location)
      const hello = this.app.make(HelloWorld, {el: div('.foo')})
      store.dispatch(location.change('world'))
    })
    next()
  }

})

Rabbit({}).services(
  HelloWorldService,
  ViewServiceProvider
).run()
