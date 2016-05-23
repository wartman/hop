import test from 'ava'
import Component from '../../src/view/Component'
import Patch from '../../src/view/Patch'
import {div, p} from '../../src/view/elements'

const TestComponent = Component.methods({

  render() {
    return div('.hello', [
      p('hello world')
    ])
  }

})

function makeComponent() {
  return TestComponent({
    patch: Patch(),
    el: div('.hello')
  })
}

test('renders', t => {
  t.deepEqual(
    div('.hello', [
      p('hello world')
    ]), 
    makeComponent().render()
  )
})

test('sets el', t => {
  t.deepEqual(
    div('.hello'),
    makeComponent().el
  )
})

test('mounts', t => {
  let component = makeComponent()
  let el = component.el
  t.deepEqual(div('.hello'), el)

  // TODO:
  // Need a non-dom API mockup.

  // component.$invokeRender()
  // t.deepEqual(
  //   div('.hello', [
  //     p('hello world')
  //   ]),
  //   el
  // )
})
