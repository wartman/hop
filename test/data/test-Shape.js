import test from 'ava'
import Shape from '../../src/data/Shape'

// These tests are just a start: need something a lot more robust.

test('Checks types', t => {
  const shape = Shape.object.of({
    foo: Shape.string.isRequired,
    bar: Shape.array.of(Shape.string)
  })
  t.is("Error", shape.check({}).name)
  t.is(null, shape.check({
    foo: 'foo',
    bar: ['bar']
  }))
})

function testTypeChecker(checker, passing, failing) {
  test(`${checker.name} checks types`, t => {
    t.is('Error', checker.validate({
      failing
    }, 'failing', 'parent', 'test.failing').name)
    t.is(null, checker.validate({
      passing
    }, 'passing', 'parent', 'test.passing'))
  })
}

testTypeChecker(Shape.array, ['foo'], 'foo')
testTypeChecker(Shape.string, 'foo', 1)
testTypeChecker(Shape.object, {foo: 'foo'}, [])
testTypeChecker(Shape.func, function test() {}, 'foo')
testTypeChecker(Shape.func, () => {}, 'foo')
testTypeChecker(Shape.bool, true, 'foo')
testTypeChecker(Shape.bool, false, 'foo')
testTypeChecker(Shape.number, 900, 'foo')
testTypeChecker(Shape.object.of({
  foo: Shape.string,
  bar: Shape.array.of(Shape.number)
}), {foo: 'foo', bar: [1, 2]}, {foo: 'bar', bar: ['foo', 'bar', 1]})
testTypeChecker(Shape.array.of(Shape.string), ['foo', 'bar'], ['foo', 1])
testTypeChecker(Shape.array.of(Shape.object.of({
  foo: Shape.string,
  bar: Shape.array.of(Shape.number)
})), [
  {foo: 'foo', bar: [1, 2]}, 
  {foo: 'thing', bar: [1, 2]}
], [
  {foo: 'foo', bar: [1, 2]}, 
  {foo: 'bar', bar: ['foo', 'bar', 1]}
])
