import test from 'ava'
import Component from '../../src/view/Component'
import {div, p} from '../../src/view/elements'

const TestComponent = Component.methods({

  render() {
    return div('.hello', [
      p('hello world')
    ])
  }

})

function makeComponent() {
  return TestComponent()
}

test('by default, returns a Vnode', t => {
  t.deepEqual(
    div('.hello', [
      p('hello world')
    ]), 
    makeComponent()
  )
})
