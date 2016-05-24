import test from 'ava'
import Injectable from '../../src/core/Injectable'

const Foo = 'foo';
const Bar = 'bar'
const InjectableStub = Injectable.inject({
  foo: Foo,
  bar: Bar
})

test('is marked as injectable', t => {
  t.truthy(InjectableStub.$isInjectable)
})

test('returns a list of dependencies', t => {
  t.deepEqual({
    foo: Foo,
    bar: Bar
  }, InjectableStub.$getDependencies())
})

test('dependencies can be manually provided', t => {
  const stub = InjectableStub({foo: 'bar', bar: 'bin'})
  t.is('bar', stub.foo)
  t.is('bin', stub.bar)
})
