import test from 'ava'
import Update, { Action } from '../../src/data/Update'
import Shape, { StringType, ShapeOf } from '../../src/data/Shape'
import Store from '../../src/data/Store'

const store = Store.connect({foo: (state) => state}).new({app: {}})

const UpdateStub = Update.type('foo').actions({
  rename: Action('name', (state, name) => Object.assign({}, state, {name})),
  renameWithTitle: Action('name', 'title', (state, name, title) => {
    return Object.assign({}, state, {name, title})
  })
})

test('registers type', t => {
  const action = UpdateStub()
  t.is('foo', action.getType())
})

test('actions are bound correctly', t => {
  const action = UpdateStub()
  t.truthy(action.$hasAction('rename'))
})

test('formats actions', t => {
  const action = UpdateStub()
  const expected = {type: 'foo.rename', payload: {name: 'bar'}}
  t.deepEqual(expected, action.$formatAction('rename', 'bar'))
  // t.deepEqual(expected, action.rename('bar'))
})

test('runs matching reducer', t => {
  const action = UpdateStub()
  t.deepEqual({name: 'bar'}, action.reduce({name: 'foo'}, action.$formatAction('rename', 'bar')))
})

test('multiple params in an action are possible', t => {
  const action = UpdateStub()
  const expected = {type: 'foo.renameWithTitle', payload: {name: 'bar', title: 'mr'}}
  t.deepEqual(expected, action.$formatAction('renameWithTitle', ['bar', 'mr']))
  // t.deepEqual(expected, action.renameWithTitle('bar', 'mr'))
})

test('runs matching reducer with multiple params', t => {
  const action = UpdateStub()
  t.deepEqual({name: 'bar', title: 'mr'}, action.reduce(
    {name: 'foo'}, 
    action.$formatAction('renameWithTitle', ['bar', 'mr'])
  ))
})

test('dispatches attached store', t => {
  const action = UpdateStub()
  action.attachTo(store)
  action.$sendAction('renameWithTitle', ['bar', 'mr'])
  t.deepEqual({name: 'bar', title: 'mr'}, store.getState().foo)
})

test('dispatches attached store via shortcut', t => {
  const action = UpdateStub()
  action.attachTo(store)
  action.renameWithTitle('bar', 'mr')
  t.deepEqual({name: 'bar', title: 'mr'}, store.getState().foo)
})

test('Can check shape if provided', t => {
  const action = UpdateStub.shape({
    name: StringType().require(),
    title: StringType()
  }).new()
  action.attachTo(store)
  action.renameWithTitle('bar', 'mr')
  t.deepEqual({name: 'bar', title: 'mr'}, store.getState().foo)
  t.throws(() => {
    store.dispatch({type: 'foo.renameWithTitle', payload: {name: null}})
  })
})

