import test from 'ava'
import Reduceable from '../../src/data/Reduceable'

const ReduceableStub = Reduceable.type('foo')

test('registers type', t => {
  const r = ReduceableStub()
  t.is('foo', r.getType())
})

test('default handler', t => {
  const r = ReduceableStub()
  const data = {foo: 'bar'}
  t.is('bar', r.handle(data.foo, {type: 'bar', data: 'bin'}))
  t.is('changed', r.handle(data.foo, {type: 'foo', data: 'changed'}))
  t.is('bar', data.foo)
})
