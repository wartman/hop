import Patch from '../../../src/view/Patch'
import ServiceProvider from '../../../src/support/ServiceProvider'
import Main from './components/main'

const ViewServiceProvider = ServiceProvider.methods({

  register() {
    this.app.share(Patch)
    this.app.share(Main)
  },

  boot(next) {
    const patch = this.app.make(Patch)
    const main = this.app.make(Main)
    const root = document.getElementById('root')
    main.el = root
    patch(root, main.render())
    next()
  }

})

export default ViewServiceProvider
