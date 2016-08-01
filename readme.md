# Hop

A front-end framework built around [stamps](https://github.com/stampit-org/stamp-specification), with 
views powered by [snabbdom](https://github.com/paldepind/snabbdom) and state provided by a store 
inspired by [redux](https://github.com/reactjs/redux).

## Contents

* [Introducton](#introduction)
* [Features](#features)
* [Dependency Injection](#dependency-injection)
* [Store](#store)
* [View](#view)

## Introducton

Hop is an (almost) complete framework for client-side apps. The best way to figure out how it
all works is probably to read through the source and to check out the `todo` example in the
[example folder](example/todo).

Before continuing, you should familiarize yourself with [stamps](https://github.com/stampit-org/stamp-specification),
as they're used extensively in Hop. Hop has its own implementation, but it's based closely on 
the reference implementation and designed to comply with the stamp-specification (running `npm test` 
will test Hop's `Compose` function against the [test-suite](https://github.com/stampit-org/check-compose) 
provided by stampit-org).

You should also read through [snabbdom's](https://github.com/paldepind/snabbdom) code and get familiar with it.

**Important: This readme is still very much in progress** 

## Features

Hop consists of three core components:

* The service container and dependency injection framework
* A predictable state container (or "store") and a framework to update it
* React-style view components to actually show things to the user

## Dependency Injection

Dependency injection is pretty simple:

```js

import { Injectable, Container } from '@wartman/hop'
import MyDep from './MyDep'

const Foo = Injectable.inject({
  dep: MyDep
})

// To resolve dependencies:
const container = Container()
const foo = conatiner.make(Foo)

// To control how the dependency is resolved:
container.bind(Foo, c => Foo({
  dep: MyDep({someConfigOption: 'bar'})
}))
const foo2 = container.make(Foo)

// ... and a lot more.

```

In your app, you should use `ServiceProviders` to provide everything. Here's what a
`ViewServiceProvider` might look like:

```js

import { ServiceProvider, Element, Patch } from '@wartman/hop'
import MyApp from '../components/MyApp'

const ViewServiceProvider = ServiceProvider.methods({
  
  register() {
    this.app.share(Patch, c => Patch.getDefault())
    this.app.share(MyApp)
  },

  boot(next) {
    const main = this.app.make(MyApp)
    const root = Element('#root')
    main.mount(root)
    next()
  }

})

export default ViewServiceProvider

```

You'd then run your app something like this:

```js

import Hop from '@wartman/hop'
import ViewServiceProvider from './providers/ViewServiceProvider'

Hop({
  // config here
}).services(
  ViewServiceProvider
).run()

```

See the [todo](example/todo) example for a more detailed look at this.

## Store

Hop uses a predictable state container called `Store` based heavily on [Redux](https://github.com/reactjs/redux).
Reading up on it will give you a good understanding of Hop's `Store` too.

The store relies on **reducers** to modify the state, which are just functions with the signature `(state, action)`. 
The simplest way to use them is via the `connect` method on `Store`, which creates a new Stamp.

```js

import { Store } from '@wartman/hop'

const MyStore = Store.connect({
  foo(state, action) {
    switch(action.type) {
      case 'foo.bar': return 'bar'
      case 'foo.bin': return 'bin'
      default: return state
    }
  }
})

export default MyStore

```

We can now modify the `foo` property (which we call a 'resource') in our Store's state by dispatching an action:

```js

const store = container.make(MyStore, {initialState: { foo: 'foo' }})

console.log(store.getState().foo) // => 'foo'
store.dispatch({type: 'foo.bar'})
console.log(store.getState().foo) // => 'bar'

```

You COULD just create simple reducers like this for everything in your store, but Hop provides
a cleaner framework for this with its `Update` Stamp (which can be thought of as the `Model` part
of Hop). Because the expected shape of the resource is so important, Hop Updates can define that too.

```js

import { Update, Shape, Action } from '@wartman/hop'

const Foo = Update.type('foo').shape({
  value: Shape.string.isRequired
}).actions({
    
  set: Action('value', (store, value) => {
    return Object.assign({}, store, {value})
  })

})

export default Foo

```

We can add Updates to our Store with the `updates` method -- AND we'll get some fancy magic too.

```js

import { Store } from '@wartman/hop'
import Foo from '../updates/Foo'

const MyStore = Store.updates(Foo)

export default MyStore

// ... now we can do this:

const store = container.make(MyStore, {initialState: { foo: {value: 'foo'} }})
console.log(store.getState().foo) // => '{value: "foo"}'
store.foo.set('bar')
console.log(store.getState().foo) // => '{value: "bar"}'

```

Again, check out [todo](example/todo/src/updates) for a better idea of how this works.

## View

Views are made up of Components.

This section is still very much in progress, but here's an example:

```js

import { Config, Store, Component, h1, button, header } from '@wartman/hop'
import TodoTextInput from './TodoTextInput'

const Header = Component.inject({
  store: Store,
  config: Config
}).node({
  tag: 'header',
  id: 'header',
  class: 'header'
}).methods({

  render() {
    return [
      h1('todos'),

      button({
        class: { 'sync-button': true },
        on: {click: this.getFromServer.bind(this)}
      }, 'Sync'),

      TodoTextInput({
        onSave: this.handleSave.bind(this),
        newTodo: true,
        text: '',
        placeholder: this.config.get('placeholder', 'What needs doing?')
      })
    ]
  },

  handleSave(text) {
    if (text.length) {
      this.store.todos.add({text})
    }
  },

  getFromServer(e) {
    e.preventDefault()
    this.store.request.fetchAll()
  },

})

export default Header

```

## Should I Use This?

Probably not yet. Come back in a bit when things are a bit more settled and tests are more complete.
