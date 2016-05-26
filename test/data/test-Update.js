import test from 'ava'
import Update, {Action} from '../../src/data/Update'

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
  t.truthy(action.$hasUpdate('rename'))
})

test('formats actions', t => {
  const action = UpdateStub()
  const expected = {type: 'foo.rename', payload: {name: 'bar'}}
  t.deepEqual(expected, action.$sendUpdate('rename', 'bar'))
  t.deepEqual(expected, action.rename('bar'))
})

test('runs matching reducer', t => {
  const action = UpdateStub()
  t.deepEqual({name: 'bar'}, action.reduce({name: 'foo'}, action.rename('bar')))
})

test('multiple params in an action are possible', t => {
  const action = UpdateStub()
  const expected = {type: 'foo.renameWithTitle', payload: {name: 'bar', title: 'mr'}}
  t.deepEqual(expected, action.$sendUpdate('renameWithTitle', ['bar', 'mr']))
  t.deepEqual(expected, action.renameWithTitle('bar', 'mr'))
})

test('runs matching reducer with multiple params', t => {
  const action = UpdateStub()
  t.deepEqual({name: 'bar', title: 'mr'}, action.reduce({name: 'foo'}, action.renameWithTitle('bar', 'mr')))
})
