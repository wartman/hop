import test from 'ava'
import Store from '../../src/data/Store'
import Update, {Action} from '../../src/data/Update'

const StoreStub = Store.connect({
  foo(state = null, action) {
    switch (action.type) {
      case 'foo': return action.payload
      default: return state
    }
  },
  bar(state = null, action) {
    switch (action.type) {
      case 'bar': return action.payload
      default: return state
    }
  }
})

const Bif = Update.type('bif').actions({
  rename: Action('name', (state, name) => name ? name : state)
})

test('initialState sets the initial state', t => {
  const store = StoreStub({initialState: {foo: 'bar'}})
  t.deepEqual({foo: 'bar'}, store.getState())
})

test('state is modified by dispatch', t => {
  const store = StoreStub({initialState: {foo: 'bar', bar: 'bar'}})
  t.deepEqual({foo: 'bar', bar: 'bar'}, store.getState())
  store.dispatch({type: 'foo', payload: 'changed'})
  t.deepEqual({foo: 'changed', bar: 'bar'}, store.getState())
  store.dispatch({type: 'bar', payload: 'changed'})
  t.deepEqual({foo: 'changed', bar: 'changed'}, store.getState())
})

test('reducers can be extended', t => {
  const store = StoreStub.connect({
    bif(state = null, action) {
      switch (action.type) {
        case 'bif': return action.payload
        default: return state
      }
    }
  }).new({initialState: {foo: 'bar', bar: 'bar', bif: 'bif'}})

  t.deepEqual({foo: 'bar', bar: 'bar', bif: 'bif'}, store.getState())
  store.dispatch({type: 'bif', payload: 'changed'})
  t.deepEqual({foo: 'bar', bar: 'bar', bif: 'changed'}, store.getState())
  store.dispatch({type: 'foo', payload: 'changed'})
  t.deepEqual({foo: 'changed', bar: 'bar', bif: 'changed'}, store.getState())
  store.dispatch({type: 'bar', payload: 'changed'})
  t.deepEqual({foo: 'changed', bar: 'changed', bif: 'changed'}, store.getState())
})

test('uses reduceables', t => {
  const bif = Bif()
  const store = StoreStub.updates(bif).new({initialState: {foo: 'bar', bar: 'bar', bif: 'bif'}})

  t.deepEqual({foo: 'bar', bar: 'bar', bif: 'bif'}, store.getState())

  store.dispatch(Bif().rename('changed'))
  t.deepEqual({foo: 'bar', bar: 'bar', bif: 'changed'}, store.getState())

  store.bif.rename('changed again')
  t.deepEqual({foo: 'bar', bar: 'bar', bif: 'changed again'}, store.getState())
})

test.cb('listeners are fired when the state is changed', t => {
  t.plan(1)

  const store = StoreStub({initialState: {foo: 'bar', bar: 'bar'}})
  store.subscribe(() => {
    t.deepEqual({foo: 'changed', bar: 'bar'}, store.getState())
    t.end()
  })
  store.dispatch({type: 'foo', payload: 'changed'})
})
