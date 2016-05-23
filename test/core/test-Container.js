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

test('bindings are not resolved until they are requested', t => {
  let glob = 'ok'
  let c = Container()
  c.bind('foo', c => {
    glob = 'changed'
    return 'foo'
  })

  t.is('ok', glob)
  let thing = c.make('foo')
  t.is('changed', glob)
})

test('vanilla functions are bindable', t => {
  let c = Container()
  let Bar = function () {
    return { bar: 'bar' }
  }
  c.bind(Bar)
  let bar = c.make(Bar)
  t.is('bar', bar.bar)
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

test('creates new objects if bindings are not shared', t => {
  let c = Container()
  let twoOne = c.build(Two)
  let twoTwo = c.build(Two)
  twoOne.diff = 'diff'
  t.notDeepEqual(twoOne, twoTwo)
})

test('creates shared instances', t => {
  let c = Container()
  c.share(Two)
  let one = c.make(Two)
  let two = c.make(Two)
  one.diff = 'diff'
  t.deepEqual(one, two)
})

test('`instance` binds instances directly', t => {
  let c = Container()
  c.instance(One, One())
  let one = c.make(One)
  t.is('foo', one.foo())
  one.changed = 'yep'
  let two = c.make(One)
  t.deepEqual(one, two)
  t.is('yep', two.changed)
})

test('isShared detects shared objects', t => {
  let c = Container()
  c.share(Two)
  t.truthy(c.isShared(Two))
})

test('objects registered as instances don\'t count as `shared`', t => {
  let c = Container()
  c.instance('foo', 'foo')
  t.falsy(c.isShared('foo'))
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

test('params can be passed in to override defaults, and do so recursively', t => {
  let c = Container()
  let three = c.build(Three, {
    one: {
      foo() {
        return 'bif'
      }
    }
  })
  t.is(three.one.foo(), 'bif')
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
