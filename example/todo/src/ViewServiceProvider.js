import Patch from '../../../src/view/Patch'
import ServiceProvider from '../../../src/support/ServiceProvider'
import Element from '../../../src/view/Element'
import Main from './components/Main'
import App from './components/App'

const ViewServiceProvider = ServiceProvider.methods({

  register() {
    this.app.share(Patch, c => Patch.getDefault())
    this.app.share(Main)
    this.app.share(App)
  },

  boot(next) {
    const app = this.app.make(App)
    app.mount(Element('#root'))
    next()
  }

})

export default ViewServiceProvider
