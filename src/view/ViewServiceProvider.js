import ServiceProvider from '../support/ServiceProvider'
import Patch from './Patch'

const ViewServiceProvider = ServiceProvider.methods({

  register() {
    this.app.bind(Patch)
  }

})

export default ViewServiceProvider
