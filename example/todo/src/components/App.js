import Rabbit from '../../../../src/Rabbit'
import Component from '../../../../src/view/Component'
import {div} from '../../../../src/view/elements'
import Header from './Header'
import Footer from './Footer'
import Main from './Main'
import Spinner from './Spinner'

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
      this.app.make(Footer),
      this.app.make(Spinner)
    ]
  }

})

export default App
