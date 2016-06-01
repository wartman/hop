import test from 'ava'
import Shape, { 
  ArrayType,
  StringType,
  ObjectType,
  FuncType,
  BoolType,
  NumberType,
  ArrayOf,
  ShapeOf,
  ArrayOfShape
} from '../../src/data/Shape'

// These tests are just a start: need something a lot more robust.

test('Checks types', t => {
  const shape = Shape.describe({
    foo: StringType().require(),
    bar: ArrayOf(StringType())
  }).new({})
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

testTypeChecker(ArrayType(), ['foo'], 'foo')
testTypeChecker(StringType(), 'foo', 1)
testTypeChecker(ObjectType(), {foo: 'foo'}, [])
testTypeChecker(FuncType(), function test() {}, 'foo')
testTypeChecker(FuncType(), () => {}, 'foo')
testTypeChecker(BoolType(), true, 'foo')
testTypeChecker(BoolType(), false, 'foo')
testTypeChecker(NumberType(), 900, 'foo')
testTypeChecker(ShapeOf({
  foo: StringType(),
  bar: ArrayOf(NumberType())
}), {foo: 'foo', bar: [1, 2]}, {foo: 'bar', bar: ['foo', 'bar', 1]})
testTypeChecker(ArrayOf(StringType()), ['foo', 'bar'], ['foo', 1])
testTypeChecker(ArrayOfShape({
  foo: StringType(),
  bar: ArrayOf(NumberType())
}), [
  {foo: 'foo', bar: [1, 2]}, 
  {foo: 'thing', bar: [1, 2]}
], [
  {foo: 'foo', bar: [1, 2]}, 
  {foo: 'bar', bar: ['foo', 'bar', 1]}
])
