import test from 'ava'
import Stamp from '../../src/core/Stamp'
import Container from '../../src/core/Container'
import Injectable from '../../src/core/Injectable'

const One = Stamp.methods({
  foo() {
    return 'foo'
  }
})

const Two = Injectable.inject({
  one: One
}).methods({
  fooBar() {
    return this.one.foo() + 'bar'
  }
})

const Three = Injectable.inject({
  one: One,
  two: Two
}).methods({
  fooBarBin() {
    return this.two.fooBar() + 'bin'
  }
})

test('builds dependencies on unbound Injectables', t => {
  let c = Container()
  let two = c.build(Two)
  t.truthy(two.one)
  t.is(two.fooBar(), 'foobar')
  t.is(two.one.foo(), 'foo')
})

test('resolves dependencies on unbound Injectables with make', t => {
  let c = Container()
  let two = c.make(Two)
  t.truthy(two.one)
  t.is(two.fooBar(), 'foobar')
  t.is(two.one.foo(), 'foo')
})

test('binds functions to abstracts', t => {
  let c = Container()
  c.bind('foo', c => {
    return 'this is a foo'
  })
  t.is(c.make('foo'), 'this is a foo');
})

test('make respects bindings, build does not', t => {
  let c = Container()
  c.bind(Two, c => {
    const two = c.build(Two)
    two.bound = 'bound'
    return two
  })
  let twoMake = c.make(Two)
  let twoBuild = c.build(Two)
  t.is(twoMake.bound, 'bound')
  t.is(twoBuild.bound, undefined)
  t.is(twoMake.fooBar(), 'foobar')
  t.is(twoMake.one.foo(), 'foo')
  t.is(twoBuild.fooBar(), 'foobar')
  t.is(twoBuild.one.foo(), 'foo')
})

test('creates new objects if bindings are not singletons', t => {
  let c = Container()
  let twoOne = c.build(Two)
  let twoTwo = c.build(Two)
  twoOne.diff = 'diff'
  t.notDeepEqual(twoOne, twoTwo)
})

test('creates shared instancnes', t => {
  let c = Container()
  c.singleton(Two)
  let one = c.make(Two)
  let two = c.make(Two)
  one.diff = 'diff'
  t.deepEqual(one, two)
})

test('recursively builds dependencies', t => {
  let c = Container()
  let three = c.build(Three)
  t.is(three.one.foo(), 'foo')
  t.is(three.two.fooBar(), 'foobar')
  t.is(three.fooBarBin(), 'foobarbin')
})

test('uses bindings when building', t => {
  let c = Container()
  c.bind(One, c => {
    return {
      foo() {
        return 'bif'
      }
    }
  })
  let three = c.build(Three)
  t.is(three.fooBarBin(), 'bifbarbin')
})

test('Aliases work on functions', t => {
  let c = Container()
  let bar = function () {
    return 'bar'
  }
  c.bind(bar, c => bar)
  c.addAlias(bar, 'foo')
  t.is(c.make('foo')(), 'bar')
})

test('Aliases work on Stamps', t => {
  let c = Container()
  c.addAlias(Two, 'foo')
  t.is(c.make('foo').fooBar(), 'foobar')
})
