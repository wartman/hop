import Patch from '../../../src/view/Patch'
import ServiceProvider from '../../../src/support/ServiceProvider'
import Element from '../../../src/view/Element'
import Main from './components/main'

const ViewServiceProvider = ServiceProvider.methods({

  register() {
    this.app.share(Patch)
    this.app.share(Main, c => c.build(Main.element(Element('#root'))))
  },

  boot(next) {
    const main = this.app.make(Main)
    main.mount()
    next()
  }

})

export default ViewServiceProvider
