import test from 'ava'
import Action, {Binding} from '../../src/data/Action'

const ActionStub = Action.type('foo').actions({
  rename: Binding('name', (state, name) => Object.assign({}, state, {name})),
  renameWithTitle: Binding('name', 'title', (state, name, title) => {
    return Object.assign({}, state, {name, title})
  })
})

test('registers type', t => {
  const action = ActionStub()
  t.is('foo', action.getType())
})

test('actions are bound correctly', t => {
  const action = ActionStub()
  t.truthy(action.$hasAction('rename'))
})

test('formats actions', t => {
  const action = ActionStub()
  const expected = {type: 'foo.rename', payload: {name: 'bar'}}
  t.deepEqual(expected, action.$sendAction('rename', 'bar'))
  t.deepEqual(expected, action.rename('bar'))
})

test('runs matching reducer', t => {
  const action = ActionStub()
  t.deepEqual({name: 'bar'}, action.reduce({name: 'foo'}, action.rename('bar')))
})

test('multiple params in an action are possible', t => {
  const action = ActionStub()
  const expected = {type: 'foo.renameWithTitle', payload: {name: 'bar', title: 'mr'}}
  t.deepEqual(expected, action.$sendAction('renameWithTitle', ['bar', 'mr']))
  t.deepEqual(expected, action.renameWithTitle('bar', 'mr'))
})

test('runs matching reducer with multiple params', t => {
  const action = ActionStub()
  t.deepEqual({name: 'bar', title: 'mr'}, action.reduce({name: 'foo'}, action.renameWithTitle('bar', 'mr')))
})
