import test from 'ava'
import Shape, { StringType, ArrayOf } from '../../src/data/Shape'

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
