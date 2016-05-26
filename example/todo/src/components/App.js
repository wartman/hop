import Rabbit from '../../../../src/Rabbit'
import Component from '../../../../src/view/Component'
import Header from './Header'
import Footer from './Footer'
import Main from './Main'

const App = Component.id('root').inject({
  app: Rabbit
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
