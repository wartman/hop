import { ServiceProvider } from '../../../../core'
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
