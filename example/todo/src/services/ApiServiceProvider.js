import ServiceProvider from '../../../../src/support/ServiceProvider'
import TodoApi from '../api/TodoApi'

const ApiServiceProvider = ServiceProvider.methods({

  register() {
    this.app.share(TodoApi)
  },

  boot(next) {
    const api = this.app.make(TodoApi)
    api.listen()
    next()
  }

})

export default ApiServiceProvider
