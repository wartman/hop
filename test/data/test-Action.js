import test from 'ava'
import Action from '../../src/data/Action'

const ActionStub = Action.type('foo').methods({
  reduce(state, action) {
    if (action.type === this.getType()) {
      return action.payload
    }
    return state
  }
})

test('registers type', t => {
  const action = ActionStub()
  t.is('foo', action.getType())
})

test('formats actions', t => {
  const action = ActionStub()
  t.deepEqual({type: 'foo', payload: 'bar'}, action.send('bar'))
})

test('uses provided reducer', t => {
  const action = ActionStub()
  const data = {foo: 'bar'}
  t.is('bar', action.reduce(data.foo, {type: 'bar', payload: 'bin'}))
  t.is('changed', action.reduce(data.foo, action.send('changed')))
  t.is('bar', data.foo)
})
