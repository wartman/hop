Rabbit
======

A simple view framework with stamps, snabbdom-based virtual elements and Laravel-inspired dependency injection.


About
-----

Rabbit apps consist of Components, Updates and a single Store, all bound together with ServiceProviders.


Stores
------

The Rabbit Store is basically just a Redux store (to the point that its pretty much copied code). All
Rabbit apps have a single store which is treated as an immutable state object. You can only change it
by calling `dispatch`, and only read from it using `getState`.

###Actions

The store dispatches `actions`, which are just plain objects with (at the minimum) a `type` and a
`payload` property. For example:

```js

import Store from '@wartman/rabbit/data/Store'

const store = store()
store.dispatch({
  type: 'foo',
  payload: {
    name: 'bar'
  }
}) 

```

Of course, the above example won't do anything yet. In fact, it'll throw an error and warn
you that you can't initialize a store without adding a reducer. Which brings us to:

###Reducers

A `reducer` is just a function with the following signature:

```js
function Reducer(state, action) {
  // code
}
```

Depending on the action's type, we can modify the state. Note that this function should be pure -- 
that is, it should ALWAYS return the same output given the same input, and should not mutate the
state. 

Let's write a `person` reducer to change the name of a person in our Store:
```js

function PersonReducer(state, action) {
  if (action.type === 'person') {
    // Note how we're using Object.assign to avoid mutating the state.
    return Object.assign({}, state, {name: action.payload.name})
  }
  // If we don't change anything, return `state`.
  return state
}

```

To use this with our Store, we can use the `connect` method.

```js
store.connect({
  person: PersonReducer
})
```

The PersonReducer is now bound to the `person` property in the store, and will be run every time
we call `store.dispatch` (no matter what `action.type` is). 

```js
store.connect({
  person: PersonReducer
})
store.dispatch({type: 'person', payload: {name: 'bill'}})
const state = store.getState()
console.log(state.person.name) // => 'bill'
store.dispatch({type: 'person', payload: {name: 'alice'}})
// Let's use ES2015 object destructing:
const {person} = store.getState()
console.log(person.name) // => 'alice'
```

But what if we want something more complex? We could do this:

```js
function PersonReducer(state, action) {
  switch(action.type) {
    case 'person.add': 
      return [
        ...state,
        action.payload.person
      ] 
    case 'person.update':
      const person = action.payload.person
      return state.map(item => {
        if (item.id === id) {
          return Object.assign({}, item, person)
        }
        return item
      })
    // etc
    default: return state
  }
}
```

... but there's a better way


Updates
-------

In Rabbit, an Update is a collection of actions and reducers. Here's an example:

```js

import Update, {Action} from '@wartman/rabbit/data/Update'

const People = Update.type(
  // The type is the property we want to handle in the store.
  'people'
).actions({
  
  add: Action('person', (state, person) => {
    if(!this._id) this._id = 0
    person.id = this._id++
    return [
      ...state,
      person
    ]
  }),

  update: Action('id', 'person', (state, id, person) => {
    return state.map(item => {
      if (item.id === id) {
        return Object.assign({}, item, person)
      }
      return item
    })
  }),

  remove: Action('person', (state, person) => {
    return state.slice(state.indexOf(person), 1)
  })

})

```

`Action` is just a simple helper function. We could rewrite the `add` action from above
like so:

```js
  
  add: {
    params: 'person',
    reducer(state, person) {
      if(!this._id) this._id = 0
      person.id = this._id++
      return [
        ...state,
        person
      ]
    }
  }

```

`params` tells the Updater which properties from a dispatched action's payload
should be passed on. In the example of the `add` action, here's what the Update expects:

```js
  const people = People()
  const state = []
  const updated = people.reduce(state, {type: 'people.add', payload: {
    person: {name: 'bill'}
  }})
  console.log(updated) // => [{id: 1, name: 'bill'}]

  // note how the `type` property is simply the Update's type + the desired action
  const updatedAgain = people.reduce(updated, {type: 'people.update', payload: {
    id: 1,
    {
      name: 'alice'
    }
  }})

  console.log(updatedAgain) // => [{id: 1, name: 'alice'}]
```

Where this gets cool is when we add this to a Store, which is easily done with the Store's
`updates` static method:

```js
  
  // `updates` will create a new Stamp, not an instance
  const MyStore = Store.updates(People())

  // Let's make our instance...
  const store = MyStore()

  // MAGIC
  store.people.add({name: 'bill'})
  const {people} = store.getState()
  console.log(people) // => [{id: 1, name: 'bill'}]

  store.people.add({name: 'alice'})
  const {people} = store.getState()
  console.log(people) // => [{id: 1, name: 'bill'}, {id: 2, name: 'alice'}]

  store.people.update(1, {name: 'fred'})
  const {people} = store.getState()
  console.log(people) // => [{id: 1, name: 'fred'}, {id: 2, name: 'alice'}]

```

Lets pull back a moment. See this?

```js
store.people.update(1, {name: 'fred'})
```

The Updater knows which properties to pass to the reducer because of our action:

```js

  // ...code

  // Note the `id` and `person`?
  update: Action('id', 'person', (state, id, person) => {
    return state.map(item => {
      if (item.id === id) {
        return Object.assign({}, item, person)
      }
      return item
    })
  }),

  // ...code

```

Neat, huh?

COMING SOON
-----------

more stuff
