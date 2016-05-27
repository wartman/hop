import Rabbit from '../../../../src/Rabbit'
import Component from '../../../../src/view/Component'
import Header from './Header'
import Footer from './Footer'
import Main from './Main'

const App = Component.inject({
  app: Rabbit
}).node({
  tag: 'section',
  id: 'root',
  class: 'todoapp'
}).methods({

  render() {
    return [
      this.app.make(Header),
      this.app.make(Main),
      this.app.make(Footer)
    ]
  }

})

export default App
